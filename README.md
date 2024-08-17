= PORTS
These are production ports
DEV_DB_PORT=3306
PROD_DB_PORT=3306
PORT=3000

These are development ports
DEV_DB_PORT=3000
PROD_DB_PORT=3000
PORT=3001

MAC Port Re-routing
ssh -f veilkro@premium250.web-hosting.com -p21098 -L 3000:127.0.0.1:3306 -N
mysql -h 127.0.0.1 -P 3000 veilkro_digitajoe -p -u veilkro_joevs
L!VE39UVo$$6yqqkQNKPMfmNmR@k