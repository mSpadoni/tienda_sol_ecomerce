# Keycloak para Render: imagen oficial + los temas de login de Tienda Sol
FROM quay.io/keycloak/keycloak:26.4.4 AS builder
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
# Una sola instancia: caché local en vez de clúster (Infinispan/JGroups), usa mucha menos memoria
ENV KC_CACHE=local
COPY themes/ /opt/keycloak/themes/
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.4.4
COPY --from=builder /opt/keycloak/ /opt/keycloak/
# Render pone su propio proxy HTTPS adelante: Keycloak escucha HTTP en el puerto 8080
ENV KC_HTTP_ENABLED=true
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HOSTNAME_STRICT=false
# Menos memoria para entrar en el plan gratis (512 MB)
ENV KC_CACHE=local
# JVM chica para los 512 MB del plan gratis de Render: SerialGC (G1 usa más
# memoria propia), heap fijo y solo el compilador C1.
ENV JAVA_OPTS="-Xms64m -Xmx224m -XX:MaxMetaspaceSize=150m -XX:ReservedCodeCacheSize=48m -XX:MaxDirectMemorySize=32m -Xss512k -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -XX:+ExitOnOutOfMemoryError -Dfile.encoding=UTF-8 -Djava.security.egd=file:/dev/urandom"
EXPOSE 8080
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized"]
