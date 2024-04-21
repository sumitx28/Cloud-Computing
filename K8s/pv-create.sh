#!/bin/bash

gcloud container clusters get-credentials kubernetes-csci5709-cluster --zone us-central1-c
kubectl apply -f pv-claim-file.yaml
