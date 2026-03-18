import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 1 }, // Ramp up to 20 users
    { duration: '1m', target: 20 }, // Stay at 20 users (Stress the Redirect/Auth)
    { duration: '20s', target: 0 }, // Ramp down
  ],
};

const BASE_URL = 'http://host.containers.internal:4002';
// const BASE_URL = 'http://localhost:3001';

export default async function () {
  const payload = {
    email: `${randomString(8)}@example.com`,
    password: 'password123',
  };
  const signupPayload = JSON.stringify({ ...payload, name: `User_${randomString(5)}` });
  const loginPayload = JSON.stringify(payload);

  const params = { headers: { 'Content-Type': 'application/json' } };

  // 1. SIGNUP
  let signupRes = http.post(`${BASE_URL}/auth/signup`, signupPayload, params);

  check(signupRes, { 'signup successful': (r) => r.status === 201 });

  // 2. LOGIN (to get the Token)
  let loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);

  let token = loginRes.json('data.jwtToken');

  check(loginRes, { 'login successful': (r) => r.status === 200 });

  const authParams = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // 3. CREATE CODE (Short URL)
  let createRes = http.post(
    `${BASE_URL}/u`,
    JSON.stringify({
      url: 'https://google.com',
      description: 'Load Test Link',
    }),
    authParams,
  );

  let code = createRes.json('data'); // Adjust based on your actual NestJS response structure

  check(createRes, { 'code created': (r) => r.status === 201 });

  // 4. GET CODE (The Redirect - High Traffic Endpoint)
  // We hit this a few times to simulate multiple people clicking one link
  for (let i = 0; i < 3; i++) {
    let redirectRes = http.get(`${BASE_URL}/u/${code}`);
    check(redirectRes, { 'redirect hit': (r) => r.status === 200 });
    sleep(0.5);
  }

  sleep(1);
}
