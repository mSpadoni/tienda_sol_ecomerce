# Keycloak para Render: imagen oficial + los temas de login de Tienda Sol
FROM quay.io/keycloak/keycloak:26.4.4 AS builder
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
COPY themes/ /opt/keycloak/themes/
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.4.4
COPY --from=builder /opt/keycloak/ /opt/keycloak/
# Render pone su propio proxy HTTPS adelante: Keycloak escucha HTTP en el puerto 8080
ENV KC_HTTP_ENABLED=true
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HOSTNAME_STRICT=false
# Menos memoria para entrar en el plan gratis (512 MB)
ENV JAVA_OPTS_KC_HEAP="-XX:MaxRAMPercentage=65 -XX:+UseSerialGC"
EXPOSE 8080
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized"]
