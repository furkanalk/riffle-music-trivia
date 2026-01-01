#!/bin/bash

# ==============================================================================
# RIFFLE ZERO TRUST - CERTIFICATE AUTHORITY GENERATOR
# Generates self-signed CA and mTLS certificates for infrastructure and services
# ==============================================================================

# Configuration (Modify as however you see fit :)
COUNTRY="US"
STATE="CA"
LOCALITY="Red House"
ORG="Jimi Hendrix Experience"
UNIT="Infra"

# Base Subject String
BASE_SUBJ="/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORG/OU=$UNIT"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Target directory (must be gitignored)
CERTS_DIR="./ops/secrets/certs"

echo -e "${CYAN}Riffle Zero Trust - CA Generator Initiated...${NC}"
echo "--------------------------------------------------------"

# Prepare directory
if [ -d "$CERTS_DIR" ]; then
    echo -e "${YELLOW}Existing certificates found. Cleaning up...${NC}"
    rm -rf "$CERTS_DIR"
fi
mkdir -p "$CERTS_DIR"
echo -e "${GREEN}Directory ready: $CERTS_DIR${NC}"

# Root CA
echo -e "\n${CYAN}Generating Root CA...${NC}"
openssl genrsa -out "$CERTS_DIR/ca.key" 4096
openssl req -x509 -new -nodes -key "$CERTS_DIR/ca.key" -sha256 -days 3650 \
    -out "$CERTS_DIR/ca.crt" \
    -subj "$BASE_SUBJ/CN=RiffleRootCA"

echo -e "${GREEN}Root CA generated.${NC}"

# Certificate generator
generate_cert() {
    local FILENAME=$1
    local CN=$2

    echo -e "\n${YELLOW}Generating certificate: $FILENAME (CN=$CN)${NC}"

    openssl genrsa -out "$CERTS_DIR/$FILENAME.key" 2048

    openssl req -new -key "$CERTS_DIR/$FILENAME.key" \
        -out "$CERTS_DIR/$FILENAME.csr" \
        -subj "$BASE_SUBJ/CN=$CN"

    openssl x509 -req -in "$CERTS_DIR/$FILENAME.csr" \
        -CA "$CERTS_DIR/ca.crt" \
        -CAkey "$CERTS_DIR/ca.key" \
        -CAcreateserial \
        -out "$CERTS_DIR/$FILENAME.crt" \
        -days 3650 \
        -sha256

    rm "$CERTS_DIR/$FILENAME.csr"
    echo -e "${GREEN}$FILENAME signed.${NC}"
}

echo -e "\n${CYAN}Minting certificates...${NC}"

# Generic
generate_cert "server" "localhost"
generate_cert "client" "client"

# Infrastructure
generate_cert "postgres" "store-game-pg"
generate_cert "redis" "active-game-redis"

# Services
generate_cert "core-api" "service-core-api"
generate_cert "matchmaker" "service-matchmaker"
generate_cert "worker" "service-worker"
generate_cert "store-service" "service-store"
generate_cert "music-service" "service-music"

# Permissions
echo -e "\n${CYAN}Applying file permissions...${NC}"
chmod 644 "$CERTS_DIR/ca.crt"
chmod 644 "$CERTS_DIR/"*.crt
chmod 600 "$CERTS_DIR/"*.key

echo "--------------------------------------------------------"
echo -e "${GREEN}Certificates generated successfully.${NC}"
echo -e "${CYAN}Path: $CERTS_DIR${NC}"