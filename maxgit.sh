#!/bin/bash

set -ueo pipefail

port=8444

left="$1"
right="$2"

health_url="http://localhost:${port}/_health"
target_url="http://localhost:${port}/?left=${left}&right=${right}"

if ! type curl > /dev/null 2>&1; then
  echo "Curl is not installed. Aborted." >&2
  exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR" || exit 1

wait_read () {
  sleep 5
}

open_file () {
  file="$1"
  if [ "$COMSPEC" != "" ]; then
    start "${file//\//\\\\}"
  else
    open "$file"
  fi
}

open_url () {
  url="$1"
  if [ "$COMSPEC" != "" ]; then
    rundll32 url.dll,FileProtocolHandler "${url}"
  else
    open "${url}"
  fi
}

# At first, once try opening the page. If it responds, http server is already running
if curl "$health_url" > /dev/null 2>&1; then
  open_url "$target_url"
  wait_read
  exit
fi

# No server found. Launch Max.
open_file './view.maxpat'

echo "Launching view.maxpat" >&2
printf "Waiting http server response" >&2

# Wait until Max has launched and http server become responsible
checks=0
while true; do
  if curl "$health_url" > /dev/null 2>&1; then
    break
  fi
  if [ "$checks" -gt 10 ]; then
    echo "Launching view.maxpat failed or taking too long" >&2
    exit 1
  fi
  printf "." >&2
  : $((checks++))
  sleep 1
done

open_url "$target_url"
wait_read
