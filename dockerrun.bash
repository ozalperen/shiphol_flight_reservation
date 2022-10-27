  docker run -d -e VIRTUAL_HOST=poertainer1.trippyraccoon.com \
              -e LETSENCRYPT_HOST=poertainer1.trippyraccoon.com \
              -e LETSENCRYPT_EMAIL=admin@unknownland.org \
              --network=webproxy \
              -p 9000:9000 \
              -v /var/run/docker.sock:/var/run/docker.sock \
              -v portainer_data:/data \
              --restart=always \
              --name portainer \
              -e VIRTUAL_PORT=9000 \
              portainer/portainer-ce:latest


              docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest