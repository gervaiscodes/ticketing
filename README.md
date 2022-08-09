# Ticketing

## Installation

If using Minikube:

```bash
alias kubectl="minikube kubectl --"
```

Then:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asd
export GITLAB_TOKEN='1234'
skaffold dev
```
