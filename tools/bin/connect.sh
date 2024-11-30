#!/bin/bash
set -x

chmod 400 ~/sage-page-graph-key-pair.pem
ssh -i "~/sage-page-graph-key-pair.pem" admin@ec2-3-80-76-159.compute-1.amazonaws.com