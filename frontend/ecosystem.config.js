module.exports = {
  apps: [{
    name: "fe-mockoon-manager",
    script: "serve",
    args: "-s dist",
    watch: false,
    env: {
      NODE_ENV: "production"
    },
    detach: true,
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    min_uptime: "5s",
    kill_timeout: 3000,
    wait_ready: true,
    listen_timeout: 50000,
    source_map_support: false
  }]
}