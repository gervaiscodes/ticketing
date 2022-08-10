# Ticketing

## Installation

### Hosts File

```
127.0.0.1       ticketing.dev
```

### Minikube

https://minikube.sigs.k8s.io/docs/start/

### Kubectl

Install Kubectl: https://kubernetes.io/docs/tasks/tools/#kubectl.

### Ingress Nginx

```bash
minikube addons enable ingress
```

If using someting else than Minikube, please follow instructions here: https://kubernetes.github.io/ingress-nginx/deploy/.

Forward port:

```bash
kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80
```

### Secrets

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asd
```

### Gitlab Token

Create a personnal access token: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html.

```bash
export GITLAB_TOKEN='1234'
```

This is used by Skaffold to download dependencies (Docker and NPM).

### NPM Config

```bash
npm config set -- '//1337148.com.com/api/v4/projects/20/packages/npm/:_authToken' "<gitlab token>"
```

This is used to install dependencies locally, for example to `npm run test`.

### Skaffold

Install Skaffold: https://skaffold.dev/docs/install/.

Run Skaffold:

```bash
skaffold dev
```

### Access Application

http://ticketing.dev:8080
