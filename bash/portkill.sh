#!/bin/bash

# Kill all running Node.js processes
killall node > /dev/null 2>&1

cat << 'EOF'
##################################################
# ____ ___ ____ ___ _____  _       _  ___  _____ #
#|  _ \_ _/ ___|_ _|_   _|/ \     | |/ _ \| ____|#
#| | | | | |  _ | |  | | / _ \ _  | | | | |  _|  #
#| |_| | | |_| || |  | |/ ___ \ |_| | |_| | |___ #
#|____/___\____|___| |_/_/   \_\___/ \___/|_____|#
##################################################
EOF

# Capture the current time, IP address, and domain path being accessed
CURRENT_TIME=$(date +"%Y-%m-%d %H:%M:%S")
ENVIRONMENT="Development"
DOMAIN_PATH="digitajoe.com"

# Display additional information before the logs
cat << EOF
- Domain Path: $DOMAIN_PATH
- IP Address:  $ENVIRONMENT
- Time:        $CURRENT_TIME
EOF

# Start your Node.js server
node server.js
