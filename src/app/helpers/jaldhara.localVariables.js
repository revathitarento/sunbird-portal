const env = process.env  

process.env.sunbird_environment = 'dev'
process.env.sunbird_instance = 'jaldhara'
  
let localVariable = {   
  LEARNER_URL: 'https://upgradelms.forwater.in/api/',   
  CONTENT_URL: 'https://upgradelms.forwater.in/api/',   
  CONTENT_PROXY_URL: 'https://upgradelms.forwater.in',   
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',   
  PORTAL_AUTH_SERVER_URL: 'https://upgradelms.forwater.in/auth',   
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || 'portal',   
  APPID: process.env.sunbird_environment + '.' + process.env.sunbird_instance + '.portal',   
  DEFAULT_CHANNEL: env.sunbird_default_channel || 'jaldhara', 
  DEFAUULT_TENANT: env.sunbird_default_tenant || 'jaldhara',  
  EKSTEP_ENV: env.ekstep_env || 'qa',   
  PORTAL_PORT: env.sunbird_port || 3000,   
  PORTAL_API_AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1YmY1N2Y2NmU2MGE0MmE2YjBmZWUyOWQzYzAxZjhkNyJ9.MRzGcRpS5BTlkV54borHYT6-FS-HenmSn1ak9MC6tEQ',   
  PORTAL_TELEMETRY_PACKET_SIZE: env.sunbird_telemetry_packet_size || 20,   
  PORTAL_ECHO_API_URL: 'https://upgradelms.forwater.in/api/echo/',   
  PORTAL_AUTOCREATE_TRAMPOLINE_USER: env.sunbird_autocreate_trampoline_user || 'true',   
  PORTAL_TRAMPOLINE_CLIENT_ID: env.sunbird_trampoline_client_id || 'trampoline',   
  PORTAL_TRAMPOLINE_SECRET: env.sunbird_trampoline_secret,   
  ENABLE_PERMISSION_CHECK: env.sunbird_enabless_permission_check || 0,   
  PORTAL_SESSION_STORE_TYPE: env.sunbird_session_store_type || 'in-memory',   
  PORTAL_TITLE_NAME: 'Forwater',   
  PORTAL_CDN_URL: env.sunbird_cdn_url || '',   
  PORTAL_THEME: env.sunbird_theme || 'default',   
  PORTAL_DEFAULT_LANGUAGE: env.sunbird_portal_default_language || 'en',   
  PORTAL_PRIMARY_BUNDLE_LANGUAGE: env.sunbird_portal_primary_bundle_language || 'en',   
  CONTENT_SERVICE_UPSTREAM_URL: env.sunbird_content_service_upstream_url || 'http://localhost:5000/',   
  LEARNER_SERVICE_UPSTREAM_URL: env.sunbird_learner_service_upstream_url || 'http://localhost:9000/',   
  DATASERVICE_URL: env.sunbird_dataservice_url || 'https://upgradelms.forwater.in/api/',   
  KEY_CLOAK_PUBLIC: env.sunbird_keycloak_public || 'true',   
  KEY_CLOAK_REALM: env.sunbird_keycloak_realm || 'sunbird',   
  CACHE_STORE: env.sunbird_cache_store || 'memory',   
  CACHE_TTL: env.sunbird_cache_ttl || 1800,   
  CONTENT_CHANNEL_FILTER_TYPE: env.sunbird_content_channel_filter_type || 'self',   
  learner_Service_Local_BaseUrl: env.sunbird_learner_service_local_base_url || 'http://learner-service:9000',   
  content_Service_Local_BaseUrl: env.sunbird_content_service_local_base_url || 'http://content_service_content_service:5000',   
  ANDROID_APP_URL: env.sunbird_android_app_url || 'http://www.sunbird.org',   
  EXPLORE_BUTTON_VISIBILITY: env.sunbird_explore_button_visibility || 'false',   
  ENABLE_SIGNUP: env.sunbird_enable_signup || 'true',   
  TELEMETRY_SERVICE_LOCAL_URL: env.sunbird_telemetry_service_local_url || 'http://telemetry-service:9001/', 
  JALDHARA_LOGO: env.jaldhara_app_logo || 'http://localhost:3000/assets/forwater_logo.png',
  JALDHARA_FAVICON_ICON: env.jaldhara_favicon_icon || 'http://localhost:3000/assets/forwater_favicon.ico'   
}  
 
module.exports = localVariable
