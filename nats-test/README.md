# NATS Test

Get the name of the NATS pod:

```bash
kubectl get po -A
```

Forward port:

```bash
kubectl port-forward nats-depl-699cb89644-fmtdb 4222:4222
kubectl port-forward nats-depl-699cb89644-fmtdb 8222:8222
```

Run publisher:

```bash
npm run publish
npm run listen
```

Monitoring: http://127.0.0.1:8222/
