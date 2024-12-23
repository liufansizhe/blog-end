module.exports = {
  apps: [
    {
      name: "node", // 应用程序的名称
      script:
        "C:\\Users\\mingjie\\AppData\\Roaming\\nvm\\v22.4.1\\node_modules\\npm\\bin\\npm-cli.js", // 启动脚本的参数
      cwd: "./", // Vite 项目的根目录
      args: "-- run dev",
    },
  ],
};
