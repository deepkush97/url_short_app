# URL short App backend

## Useful kubectl commands

### 1. Project Lifecycle

Use these to manage your entire stack at once using your YAML folder.

- **Deploy/Update everything:**
  ```bash
  kubectl apply -f ./k8s/
  ```
- **Check status of all resources:**
  ```bash
  kubectl get all -n <namespace>
  ```
- **Delete the entire stack:**
  ```bash
  kubectl delete -f ./k8s/
  ```

---

### 2. Inspecting Resources

Commands to see what is running and how it is configured.

- **List Pods (with real-time updates):**
  ```bash
  kubectl get pods -n <namespace> -w
  ```
- **List Services (to see IPs and Ports):**
  ```bash
  kubectl get svc -n <namespace>
  ```
- **Describe a Resource (for deep debugging of errors):**
  ```bash
  kubectl describe pod <pod-name> -n <namespace>
  ```
- **View ConfigMaps/Secrets:**
  ```bash
  kubectl get configmap <name> -o yaml -n <namespace>
  ```

---

### 3. Debugging & Logs

When your app crashes (e.g., `CrashLoopBackOff`), use these to find out why.

- **Stream live logs:**
  ```bash
  kubectl logs -f <pod-name> -n <namespace>
  ```
- **View logs from a PREVIOUS crash:**
  ```bash
  kubectl logs <pod-name> -n <namespace> --previous
  ```
- **Execute a command inside a Pod (e.g., check env vars):**
  ```bash
  kubectl exec -it <pod-name> -n <namespace> -- printenv
  ```
- **Open an interactive shell inside a Pod:**
  ```bash
  kubectl exec -it <pod-name> -n <namespace> -- sh
  ```

---

### 4. Networking & Access

How to connect to your database or API from your local machine.

- **Port-Forward to a Service (Temporary access):**
  ```bash
  kubectl port-forward svc/<service-name> <local-port>:<service-port> -n <namespace>
  ```
- **Minikube Tunnel (For LoadBalancer services):**
  ```bash
  minikube tunnel
  ```
- **Get Minikube IP:**
  ```bash
  minikube ip
  ```

---

### 5. Maintenance & Updates

Commands for refreshing your app after a code or config change.

- **Restart a Deployment (to pick up new Image/Config):**
  ```bash
  kubectl rollout restart deployment <deployment-name> -n <namespace>
  ```
- **Scale a Deployment (e.g., to 0 to "pause" it):**
  ```bash
  kubectl scale deployment <name> --replicas=0 -n <namespace>
  ```

---

> **💡 Quick Tip:** If you ever get a "Database Access Denied" error after changing your `DB_USER` in a ConfigMap, you must delete the PVC to force a fresh initialization:

```bash
kubectl delete pvc <pvc-name> -n <namespace>
```
