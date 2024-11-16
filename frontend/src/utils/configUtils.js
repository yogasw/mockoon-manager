// frontend/src/utils/configUtils.js

export const healthzEndpoint = {
  uuid: "5f5b0d00-0000-0000-0000-000000000001",
  documentation: "Health check endpoint",
  method: "get",
  endpoint: "healthz",
  responses: [
    {
      uuid: "5f5b0d00-0000-0000-0000-000000000002",
      body: "{\n  \"status\": \"OK\",\n  \"timestamp\": \"{{now}}\"\n}",
      latency: 0,
      statusCode: 200,
      label: "Success",
      headers: [
        {
          key: "Content-Type",
          value: "application/json"
        }
      ],
      filePath: "",
      sendFileAsBody: false,
      rules: [],
      rulesOperator: "OR",
      disableTemplating: false,
      fallbackTo404: false,
      default: true
    }
  ],
  enabled: true,
  responseMode: null
};

export const addHealthCheckEndpoint = (configData) => {
  try {
    // Parse if string
    const config = typeof configData === 'string' ? JSON.parse(configData) : configData;
    
    // Check if routes exist and is an array
    if (!Array.isArray(config.routes)) {
      config.routes = [];
    }

    // Check if healthz endpoint already exists
    const hasHealthz = config.routes.some(route => 
      route.endpoint === 'healthz' && route.method === 'get'
    );

    // Add healthz endpoint if it doesn't exist
    if (!hasHealthz) {
      config.routes.unshift(healthzEndpoint);
    }

    return config;
  } catch (error) {
    console.error('Error manipulating config:', error);
    throw new Error('Invalid configuration format');
  }
};
