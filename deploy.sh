#!/bin/bash

# Pass the argument to the remote deploy.sh script
ssh -p 21098 veilkro@digitajoe.com "/home/veilkro/digitajoe.com/deploy.sh $1"
