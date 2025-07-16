// PromptELT - Enhanced Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Application data - normally this would come from API calls
  const appData = {
    databases: [
      {
        id: "db1",
        name: "Production MSSQL",
        type: "MSSQL",
        host: "prod-sql.company.com",
        port: "1433",
        database: "CustomerDB",
        status: "connected",
        lastConnected: "2025-06-04T10:30:00Z",
        dataVolume: "15.2TB",
        cost: "$2,400/month"
      },
      {
        id: "db2", 
        name: "Analytics Snowflake",
        type: "Snowflake",
        host: "analytics.snowflakecomputing.com",
        port: "443",
        database: "ANALYTICS_DW",
        status: "connected",
        lastConnected: "2025-06-04T09:15:00Z",
        dataVolume: "25.8TB",
        cost: "$4,200/month"
      },
      {
        id: "db3",
        name: "ML Databricks",
        type: "Databricks", 
        host: "ml-workspace.databricks.com",
        port: "443",
        database: "ml_feature_store",
        status: "connected",
        lastConnected: "2025-06-04T08:45:00Z",
        dataVolume: "8.5TB",
        cost: "$1,800/month"
      },
      {
        id: "db4",
        name: "Legacy Oracle",
        type: "Oracle",
        host: "legacy-oracle.company.com", 
        port: "1521",
        database: "ORCL",
        status: "connected",
        lastConnected: "2025-06-04T08:00:00Z",
        dataVolume: "12.0TB",
        cost: "$2,000/month"
      },
      {
        id: "db5",
        name: "Salesforce CRM",
        type: "Salesforce",
        host: "company.salesforce.com",
        port: "443",
        database: "CRM_ORG",
        status: "connected",
        lastConnected: "2025-06-04T07:30:00Z",
        dataVolume: "0.5TB",
        cost: "$1,200/month"
      },
      {
        id: "db6",
        name: "PostgreSQL Analytics",
        type: "PostgreSQL",
        host: "analytics-pg.company.com",
        port: "5432",
        database: "analytics_db",
        status: "connected",
        lastConnected: "2025-06-04T06:15:00Z",
        dataVolume: "1.5TB",
        cost: "$800/month"
      }
    ],
    queryHistory: [
      {
        id: "q1",
        prompt: "Show me the top 10 customers by revenue this year from SQL Server",
        sql: "SELECT customer_name, SUM(order_total) as total_revenue FROM customers c JOIN orders o ON c.id = o.customer_id WHERE YEAR(o.order_date) = 2025 GROUP BY customer_name ORDER BY total_revenue DESC LIMIT 10",
        database: "Production MSSQL",
        timestamp: "2025-06-04T10:45:00Z",
        status: "success",
        rows: 10,
        executionTime: "2.3s"
      },
      {
        id: "q2", 
        prompt: "Find all orders from last month with shipping delays in Snowflake",
        sql: "SELECT order_id, customer_name, order_date, shipped_date, DATEDIFF(day, order_date, shipped_date) as delay_days FROM orders o JOIN customers c ON o.customer_id = c.id WHERE shipped_date > DATEADD(day, 3, order_date) AND order_date >= DATEADD(month, -1, CURRENT_DATE())",
        database: "Analytics Snowflake", 
        timestamp: "2025-06-04T09:30:00Z",
        status: "success",
        rows: 23,
        executionTime: "1.8s"
      },
      {
        id: "q3",
        prompt: "Get average sales by product category from all databases",
        sql: "SELECT category, AVG(sales_amount) as avg_sales FROM products p JOIN sales s ON p.id = s.product_id GROUP BY category ORDER BY avg_sales DESC",
        database: "All Databases",
        timestamp: "2025-06-04T08:15:00Z", 
        status: "success",
        rows: 8,
        executionTime: "5.2s"
      }
    ],
    pipelines: [
      {
        id: "p1",
        name: "Customer Data Sync",
        source: "Production MSSQL",
        target: "Analytics Snowflake", 
        description: "Daily sync of customer data from production to analytics warehouse",
        schedule: "Daily at 2:00 AM",
        status: "active",
        lastRun: "2025-06-04T02:00:00Z",
        nextRun: "2025-06-05T02:00:00Z",
        dataProcessed: "2.1GB",
        executionTime: "15m 32s"
      },
      {
        id: "p2",
        name: "ML Feature Pipeline", 
        source: "Analytics Snowflake",
        target: "ML Databricks",
        description: "Extract and transform features for machine learning models",
        schedule: "Hourly",
        status: "active",
        lastRun: "2025-06-04T11:00:00Z",
        nextRun: "2025-06-04T12:00:00Z",
        dataProcessed: "850MB",
        executionTime: "8m 15s"
      },
      {
        id: "p3",
        name: "Legacy Data Migration",
        source: "Legacy Oracle", 
        target: "Analytics Snowflake",
        description: "Migrate historical data from legacy Oracle system",
        schedule: "Weekly on Sunday",
        status: "active", 
        lastRun: "2025-06-02T01:00:00Z",
        nextRun: "2025-06-09T01:00:00Z",
        dataProcessed: "15.2GB",
        executionTime: "2h 45m"
      },
      {
        id: "p4",
        name: "Salesforce to Snowflake",
        source: "Salesforce CRM",
        target: "Analytics Snowflake",
        description: "Sync CRM data to analytics platform",
        schedule: "Every 4 hours",
        status: "active",
        lastRun: "2025-06-04T08:00:00Z",
        nextRun: "2025-06-04T12:00:00Z",
        dataProcessed: "125MB",
        executionTime: "3m 22s"
      }
    ],
    sampleQueries: [
      "Show me all customers from last month",
      "Find the top 10 products by sales volume", 
      "Get average revenue by region",
      "List all orders with shipping delays",
      "Show daily sales trends for the past week",
      "Find customers who haven't ordered in 6 months",
      "Get inventory levels below reorder point",
      "Show employee performance metrics",
      "Compare sales between SQL Server and Snowflake",
      "Migrate customer data from Oracle to PostgreSQL"
    ],
    aiModels: [
      { id: "gpt-4", name: "GPT-4", description: "Most capable model for complex queries" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
      { id: "claude-3", name: "Claude 3", description: "Excellent for data analysis" },
      { id: "llama-3", name: "Llama 3", description: "Open source alternative" }
    ],
    migrationHistory: [
      {
        id: "m1",
        source: "Legacy Oracle",
        target: "Analytics Snowflake",
        status: "completed",
        dataMigrated: "12.0TB",
        duration: "8h 30m",
        timestamp: "2025-06-02T01:00:00Z"
      },
      {
        id: "m2",
        source: "Production MSSQL",
        target: "PostgreSQL Analytics",
        status: "in-progress",
        dataMigrated: "8.5TB",
        duration: "4h 15m",
        timestamp: "2025-06-04T07:00:00Z"
      }
    ],
    governancePolicies: [
      {
        id: "gp1",
        name: "Customer Data Protection",
        database: "All Databases",
        description: "Ensure PII data is properly encrypted and access controlled",
        status: "active"
      },
      {
        id: "gp2",
        name: "Data Retention Policy",
        database: "Analytics Snowflake",
        description: "Automatically archive data older than 7 years",
        status: "active"
      }
    ]
  };

  // Initialize the application
  initApp();

  function initApp() {
    // Set up navigation
    setupNavigation();
    
    // Initialize views with data
    initDashboardView();
    initConversationalView();
    initQueryLabView();
    initPipelinesView();
    initMigrationView();
    initGovernanceView();
    
    // Set up modal functionality
    setupModals();
    
    // Set up event listeners for buttons and interactions
    setupEventListeners();
    
    // Initialize flow diagram
    initFlowDiagram();
    setupPromptELTFlowDiagram();
  }
  
  // Navigation functionality
  function setupNavigation() {
    // Tab navigation logic
    const navTabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.view');
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const viewName = tab.getAttribute('data-view');
        views.forEach(view => {
          if (view.id === viewName) {
            view.style.display = '';
            view.classList.add('active');
          } else {
            view.style.display = 'none';
            view.classList.remove('active');
          }
        });
      });
    });
    
    // Quick navigation buttons
    document.getElementById('add-db-btn').addEventListener('click', () => {
      // Switch to conversational setup
      navTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      
      document.querySelector('[data-view="conversational"]').classList.add('active');
      document.getElementById('conversational-view').classList.add('active');
    });
  }
  
  // Dashboard View Initialization
  function initDashboardView() {
    // Render connected databases
    renderDatabasesGrid(appData.databases, document.getElementById('databases-grid'));
    
    // Render recent queries
    const recentQueriesList = document.getElementById('recent-queries-list');
    appData.queryHistory.slice(0, 5).forEach(query => {
      recentQueriesList.appendChild(createQueryHistoryItem(query));
    });
    
    // Render pipeline runs
    const pipelineRunsList = document.getElementById('pipeline-runs-list');
    appData.pipelines.slice(0, 5).forEach(pipeline => {
      pipelineRunsList.appendChild(createPipelineRunItem(pipeline));
    });
  }
  
  // Conversational View Initialization
  function initConversationalView() {
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input-field');
    const quickActions = document.querySelectorAll('.quick-action-btn');
    
    // Send message functionality
    sendButton.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        addUserMessage(message);
        processConversationalMessage(message);
        chatInput.value = '';
      }
    });
    
    // Enter key to send
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
      }
    });
    
    // Quick action buttons
    quickActions.forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        addUserMessage(prompt);
        processConversationalMessage(prompt);
      });
    });
  }
  
  // Query Lab View Initialization
  function initQueryLabView() {
    // Populate database selector
    const dbSelector = document.getElementById('query-db-selector');
    dbSelector.innerHTML = '<option value="">All Databases</option>';
    appData.databases.forEach(db => {
      const option = document.createElement('option');
      option.value = db.id;
      option.textContent = db.name;
      dbSelector.appendChild(option);
    });
    
    // Populate example queries
    const examplesList = document.getElementById('examples-list');
    appData.sampleQueries.forEach(query => {
      const example = document.createElement('div');
      example.className = 'example-item';
      example.textContent = query;
      example.addEventListener('click', () => {
        document.getElementById('prompt-input').value = query;
      });
      examplesList.appendChild(example);
    });

    // Make Query Lab examples clickable
    document.querySelectorAll('.examples-list .example-item').forEach(item => {
      item.addEventListener('click', function() {
        const prompt = this.getAttribute('data-prompt');
        const textarea = document.getElementById('prompt-input');
        if (textarea) textarea.value = prompt;
      });
    });
    
    // Set up query execution
    const executeBtn = document.getElementById('execute-query-btn');
    const explainBtn = document.getElementById('explain-query-btn');
    const saveBtn = document.getElementById('save-query-btn');
    
    executeBtn.addEventListener('click', executeQuery);
    explainBtn.addEventListener('click', explainQuery);
    saveBtn.addEventListener('click', saveQuery);
    
    // Set up output tabs
    setupOutputTabs();
  }
  
  // Pipelines View Initialization
  function initPipelinesView() {
    const pipelinesGrid = document.getElementById('pipelines-grid');
    appData.pipelines.forEach(pipeline => {
      pipelinesGrid.appendChild(createPipelineItem(pipeline));
    });
    
    // Pipeline creation
    const generateBtn = document.getElementById('generate-pipeline-btn');
    const suggestBtn = document.getElementById('suggest-pipeline-btn');
    
    generateBtn.addEventListener('click', generatePipeline);
    suggestBtn.addEventListener('click', suggestPipeline);
  }
  
  // Migration View Initialization
  function initMigrationView() {
    const sourceSelect = document.getElementById('source-database');
    const targetSelect = document.getElementById('target-database');
    
    // Populate database selectors
    appData.databases.forEach(db => {
      const sourceOption = document.createElement('option');
      sourceOption.value = db.id;
      sourceOption.textContent = db.name;
      sourceSelect.appendChild(sourceOption);
      
      const targetOption = document.createElement('option');
      targetOption.value = db.id;
      targetOption.textContent = db.name;
      targetSelect.appendChild(targetOption);
    });
    
    // Migration wizard
    const nextBtn = document.getElementById('next-step-btn');
    const prevBtn = document.getElementById('prev-step-btn');
    const startBtn = document.getElementById('start-migration-btn');
    
    nextBtn.addEventListener('click', nextMigrationStep);
    prevBtn.addEventListener('click', prevMigrationStep);
    startBtn.addEventListener('click', startMigration);
  }
  
  // Governance View Initialization
  function initGovernanceView() {
    const schemaDbSelector = document.getElementById('schema-database-selector');
    schemaDbSelector.innerHTML = '<option value="">Select Database</option>';
    appData.databases.forEach(db => {
      const option = document.createElement('option');
      option.value = db.id;
      option.textContent = db.name;
      schemaDbSelector.appendChild(option);
    });
    
    // Populate policies
    const policiesList = document.getElementById('policies-list');
    appData.governancePolicies.forEach(policy => {
      policiesList.appendChild(createPolicyItem(policy));
    });
  }
  
  // Conversational AI Functions
  function addUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function addAIMessage(message, type = 'text') {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    if (type === 'setup') {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${message}</p>
          <div class="setup-preview-content">
            <h4>Generated Configuration:</h4>
            <pre><code>${generateSetupConfig(message)}</code></pre>
          </div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${message}</p>
        </div>
      `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function processConversationalMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simulate AI processing delay
    setTimeout(() => {
      if (lowerMessage.includes('connect') && lowerMessage.includes('sql server')) {
        addAIMessage("I'll help you connect to your SQL Server database. I can see you want to establish a connection. Let me generate the configuration for you.", 'setup');
      } else if (lowerMessage.includes('pipeline') && lowerMessage.includes('snowflake') && lowerMessage.includes('databricks')) {
        addAIMessage("I'll create a pipeline from Snowflake to Databricks for you. This will enable data flow between your analytics warehouse and ML platform.", 'setup');
      } else if (lowerMessage.includes('migrate') && lowerMessage.includes('oracle') && lowerMessage.includes('postgresql')) {
        addAIMessage("I'll help you migrate data from Oracle to PostgreSQL. Let me analyze the schema and create a migration plan.", 'setup');
      } else {
        addAIMessage("I understand you want to work with your data. I can help you connect databases, create pipelines, migrate data, or set up governance policies. What specific task would you like to accomplish?");
      }
    }, 1000);
  }
  
  function generateSetupConfig(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sql server')) {
      return `{
  "database": {
    "type": "MSSQL",
    "host": "your-server.com",
    "port": 1433,
    "database": "your_database",
    "username": "your_username",
    "encrypted": true
  },
  "connection": {
    "timeout": 30,
    "pool_size": 10,
    "ssl": true
  }
}`;
    } else if (lowerMessage.includes('pipeline')) {
      return `{
  "pipeline": {
    "name": "Snowflake to Databricks",
    "source": "snowflake_connection",
    "target": "databricks_connection",
    "schedule": "hourly",
    "transformations": [
      "data_validation",
      "schema_mapping",
      "data_quality_checks"
    ]
  }
}`;
    }
    
    return "Configuration will be generated based on your requirements.";
  }
  
  // Query Lab Functions
  function executeQuery() {
    const prompt = document.getElementById('prompt-input').value.trim();
    const selectedDb = document.getElementById('query-db-selector').value;
    
    if (!prompt) {
      showToast('Please enter a query prompt', 'warning');
      return;
    }
    
    // Simulate query processing
    showToast('Processing your query...', 'info');
    
    setTimeout(() => {
      const sql = generateSQL(prompt, selectedDb);
      const results = generateResults(prompt);
      
      document.getElementById('sql-output').innerHTML = `<code>${sql}</code>`;
      document.getElementById('sql-database-badge').textContent = selectedDb ? 
        appData.databases.find(db => db.id === selectedDb)?.name : 'All Databases';
      
      displayQueryResults(results);
      
      // Switch to results tab
      document.querySelector('[data-tab="results"]').click();
      
      showToast('Query executed successfully', 'success');
    }, 2000);
  }
  
  function explainQuery() {
    const prompt = document.getElementById('prompt-input').value.trim();
    
    if (!prompt) {
      showToast('Please enter a query prompt first', 'warning');
      return;
    }
    
    const explanation = generateExplanation(prompt);
    document.getElementById('explanation-container').innerHTML = `
      <div class="explanation-content">
        <h4>How I interpreted your request:</h4>
        <p>${explanation}</p>
        <h4>Key components identified:</h4>
        <ul>
          <li>Data source: Customer and order tables</li>
          <li>Aggregation: Revenue calculation</li>
          <li>Filtering: Current year data</li>
          <li>Sorting: Top 10 results</li>
        </ul>
      </div>
    `;
    
    document.querySelector('[data-tab="explanation"]').click();
  }
  
  function generateSQL(prompt, databaseId) {
    const db = databaseId ? appData.databases.find(db => db.id === databaseId) : null;
    const dbType = db ? db.type : 'MSSQL';
    
    if (prompt.toLowerCase().includes('top 10 customers by revenue')) {
      if (dbType === 'Snowflake') {
        return `-- Snowflake SQL
SELECT 
  customer_name,
  SUM(order_total) as total_revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE YEAR(o.order_date) = 2025
GROUP BY customer_name
ORDER BY total_revenue DESC
LIMIT 10;`;
      } else if (dbType === 'PostgreSQL') {
        return `-- PostgreSQL SQL
SELECT 
  customer_name,
  SUM(order_total) as total_revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE EXTRACT(YEAR FROM o.order_date) = 2025
GROUP BY customer_name
ORDER BY total_revenue DESC
LIMIT 10;`;
      } else {
        return `-- ${dbType} SQL
SELECT 
  customer_name,
  SUM(order_total) as total_revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE YEAR(o.order_date) = 2025
GROUP BY customer_name
ORDER BY total_revenue DESC
LIMIT 10;`;
      }
    }
    
    return `-- Generated SQL for: ${prompt}
SELECT * FROM your_table
WHERE condition = 'value'
ORDER BY column_name;`;
  }
  
  function generateResults(prompt) {
    return {
      columns: ["Customer Name", "Total Revenue", "Order Count"],
      rows: [
        ["Acme Corporation", "$125,450", "23"],
        ["Global Industries", "$98,320", "18"], 
        ["Tech Solutions Inc", "$87,650", "15"],
        ["Mega Corp", "$76,890", "12"],
        ["Business Systems", "$65,420", "21"],
        ["Innovation Labs", "$54,780", "19"],
        ["Data Dynamics", "$43,210", "14"],
        ["Cloud Solutions", "$38,950", "16"],
        ["Future Tech", "$32,680", "11"],
        ["Digital Systems", "$28,450", "13"]
      ]
    };
  }
  
  function generateExplanation(prompt) {
    return `I analyzed your request "${prompt}" and identified that you want to find the highest-revenue customers. I'll query the customer and order tables, calculate total revenue by summing order totals, filter for this year's data, and return the top 10 results sorted by revenue in descending order.`;
  }
  
  function displayQueryResults(results) {
    const container = document.getElementById('results-container');
    
    if (!results || !results.rows || results.rows.length === 0) {
      container.innerHTML = '<p class="empty-state">No results found</p>';
      return;
    }
    
    let tableHTML = '<table class="results-table">';
    
    // Header
    tableHTML += '<thead><tr>';
    results.columns.forEach(column => {
      tableHTML += `<th>${column}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    // Body
    tableHTML += '<tbody>';
    results.rows.forEach(row => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        tableHTML += `<td>${cell}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    container.innerHTML = tableHTML;
  }
  
  // Pipeline Functions
  function generatePipeline() {
    const prompt = document.getElementById('pipeline-prompt').value.trim();
    
    if (!prompt) {
      showToast('Please describe the pipeline you want to create', 'warning');
      return;
    }
    
    const pipeline = createPipelineFromPrompt(prompt);
    displayPipelinePreview(pipeline);
    showToast('Pipeline generated successfully', 'success');
  }
  
  function createPipelineFromPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      name: "Generated Pipeline",
      source: lowerPrompt.includes('sql server') ? 'Production MSSQL' : 'Analytics Snowflake',
      target: lowerPrompt.includes('databricks') ? 'ML Databricks' : 'Analytics Snowflake',
      description: prompt,
      schedule: lowerPrompt.includes('daily') ? 'Daily' : 'Hourly',
      steps: [
        { name: 'Extract', type: 'extract', database: 'source' },
        { name: 'Transform', type: 'transform', operations: ['clean', 'validate'] },
        { name: 'Load', type: 'load', database: 'target' }
      ]
    };
  }
  
  function displayPipelinePreview(pipeline) {
    const preview = document.getElementById('pipeline-preview');
    preview.innerHTML = `
      <div class="pipeline-flow">
        <h4>${pipeline.name}</h4>
        <div class="flow-steps">
          <div class="flow-step">
            <div class="step-icon">📊</div>
            <div class="step-info">
              <strong>${pipeline.source}</strong>
              <span>Extract</span>
            </div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <div class="step-icon">⚙️</div>
            <div class="step-info">
              <strong>Transform</strong>
              <span>Clean & Validate</span>
            </div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <div class="step-icon">📈</div>
            <div class="step-info">
              <strong>${pipeline.target}</strong>
              <span>Load</span>
            </div>
          </div>
        </div>
        <div class="pipeline-schedule">
          <strong>Schedule:</strong> ${pipeline.schedule}
        </div>
      </div>
    `;
  }
  
  // Migration Functions
  let currentMigrationStep = 1;
  
  function nextMigrationStep() {
    if (currentMigrationStep < 4) {
      currentMigrationStep++;
      updateMigrationSteps();
    }
    
    if (currentMigrationStep === 4) {
      document.getElementById('next-step-btn').textContent = 'Execute Migration';
      generateMigrationPlan();
    }
  }
  
  function prevMigrationStep() {
    if (currentMigrationStep > 1) {
      currentMigrationStep--;
      updateMigrationSteps();
    }
    
    document.getElementById('next-step-btn').textContent = 'Next';
  }
  
  function updateMigrationSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 === currentMigrationStep);
    });
    
    document.getElementById('prev-step-btn').disabled = currentMigrationStep === 1;
  }
  
  function generateMigrationPlan() {
    const source = document.getElementById('source-database').value;
    const target = document.getElementById('target-database').value;
    const description = document.getElementById('migration-description').value;
    
    const plan = document.getElementById('migration-plan');
    plan.innerHTML = `
      <div class="migration-summary">
        <h4>Migration Summary</h4>
        <p><strong>From:</strong> ${appData.databases.find(db => db.id === source)?.name}</p>
        <p><strong>To:</strong> ${appData.databases.find(db => db.id === target)?.name}</p>
        <p><strong>Description:</strong> ${description}</p>
        <div class="migration-estimates">
          <p><strong>Estimated Data:</strong> 15.2TB</p>
          <p><strong>Estimated Time:</strong> 8-12 hours</p>
          <p><strong>Estimated Cost:</strong> $2,400</p>
        </div>
      </div>
    `;
  }
  
  function startMigration() {
    showToast('Migration started successfully', 'success');
    // Add migration to progress list
    const progressList = document.getElementById('migration-progress-list');
    const progressItem = document.createElement('div');
    progressItem.className = 'migration-progress-item';
    progressItem.innerHTML = `
      <div class="progress-header">
        <h4>Oracle to PostgreSQL Migration</h4>
        <span class="status status--info">In Progress</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 45%"></div>
      </div>
      <div class="progress-details">
        <span>45% Complete</span>
        <span>8.5TB / 15.2TB</span>
      </div>
    `;
    progressList.appendChild(progressItem);
  }
  
  // Utility Functions
  function renderDatabasesGrid(databases, container) {
    container.innerHTML = '';
    databases.forEach(db => {
      const card = document.createElement('div');
      card.className = `database-card ${db.type.toLowerCase()}`;
      card.innerHTML = `
        <div class="database-header">
          <div class="database-icon ${db.type.toLowerCase()}">${getDatabaseIcon(db.type)}</div>
          <div class="database-info">
            <h4>${db.name}</h4>
            <p>${db.host}:${db.port}</p>
          </div>
        </div>
        <div class="database-status">
          <span class="status-dot status-dot--${db.status === 'connected' ? 'active' : 'inactive'}"></span>
          <span>${db.status}</span>
          <span class="database-meta">
            ${db.dataVolume} • ${db.cost}
          </span>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  function getDatabaseIcon(type) {
    const iconMap = {
      'MSSQL': 'microsoft-sql-server.svg',
      'Oracle': 'oracle.svg',
      'Snowflake': 'snowflake.svg',
      'Salesforce': 'salesforce.svg',
      'PostgreSQL': 'postgresql.svg',
      'Databricks': 'databricks.svg'
    };
    
    const iconFile = iconMap[type];
    if (iconFile) {
      return `<img src="assets/icons/${iconFile}" alt="${type}" class="database-svg-icon">`;
    }
    return '🗄️';
  }
  
  function createQueryHistoryItem(query) {
    const item = document.createElement('div');
    item.className = 'query-history-item';
    item.innerHTML = `
      <div class="query-prompt">${truncateText(query.prompt, 60)}</div>
      <div class="query-meta">
        <span class="database-badge">${query.database}</span>
        <span class="query-time">${getTimeAgo(query.timestamp)}</span>
        <span class="query-status status--${query.status}">${query.rows} rows</span>
      </div>
    `;
    return item;
  }
  
  function createPipelineRunItem(pipeline) {
    const item = document.createElement('div');
    item.className = 'pipeline-run-item';
    item.innerHTML = `
      <div class="pipeline-name">${pipeline.name}</div>
      <div class="pipeline-meta">
        <span>${pipeline.dataProcessed}</span>
        <span>${pipeline.executionTime}</span>
        <span class="status status--${pipeline.status}">${pipeline.status}</span>
      </div>
    `;
    return item;
  }
  
  function createPipelineItem(pipeline) {
    const item = document.createElement('div');
    item.className = 'pipeline-item';
    item.innerHTML = `
      <div class="pipeline-header">
        <h4>${pipeline.name}</h4>
        <span class="pipeline-status status-${pipeline.status}">${pipeline.status}</span>
      </div>
      <div class="pipeline-details">
        <p class="pipeline-description">${pipeline.description}</p>
        <div class="pipeline-info">
          <div class="pipeline-info-item">
            <span class="label">Source</span>
            <span>${pipeline.source}</span>
          </div>
          <div class="pipeline-info-item">
            <span class="label">Target</span>
            <span>${pipeline.target}</span>
          </div>
          <div class="pipeline-info-item">
            <span class="label">Schedule</span>
            <span>${pipeline.schedule}</span>
          </div>
        </div>
      </div>
      <div class="pipeline-actions">
        <button class="btn btn--outline btn--sm">View Details</button>
        <button class="btn btn--outline btn--sm">Edit</button>
        <button class="btn btn--outline btn--sm">${pipeline.status === 'active' ? 'Pause' : 'Start'}</button>
      </div>
    `;
    return item;
  }
  
  function createPolicyItem(policy) {
    const item = document.createElement('div');
    item.className = 'policy-item';
    item.innerHTML = `
      <div class="policy-header">
        <h4>${policy.name}</h4>
        <span class="status status--${policy.status}">${policy.status}</span>
      </div>
      <p>${policy.description}</p>
      <div class="policy-meta">
        <span>Database: ${policy.database}</span>
      </div>
    `;
    return item;
  }
  
  function setupOutputTabs() {
    const tabs = document.querySelectorAll('.output-tab');
    const panels = document.querySelectorAll('.output-panel');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        document.querySelector(`.${targetTab}-panel`).classList.add('active');
      });
    });
  }
  
  function initFlowDiagram() {
    const canvas = document.getElementById('flow-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw flow diagram
    const databases = appData.databases.slice(0, 4); // Show first 4 databases
    const spacing = canvas.width / (databases.length + 1);
    
    databases.forEach((db, index) => {
      const x = spacing * (index + 1);
      const y = canvas.height / 2;
      
      // Draw database node
      ctx.fillStyle = getDatabaseColor(db.type);
      ctx.fillRect(x - 40, y - 30, 80, 60);
      
      // Draw database name
      ctx.fillStyle = 'white';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(db.type, x, y - 10);
      ctx.fillText(db.name.split(' ')[0], x, y + 10);
      
      // Draw connection arrows
      if (index < databases.length - 1) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 40, y);
        ctx.lineTo(x + spacing - 40, y);
        ctx.stroke();
        
        // Draw arrow
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(x + spacing - 40, y);
        ctx.lineTo(x + spacing - 50, y - 5);
        ctx.lineTo(x + spacing - 50, y + 5);
        ctx.fill();
      }
    });
  }
  
  function getDatabaseColor(type) {
    const colors = {
      'MSSQL': '#CC2927',
      'Oracle': '#F80000',
      'Snowflake': '#29B5E8',
      'Salesforce': '#00A1E0',
      'PostgreSQL': '#336791',
      'Databricks': '#FF3621'
    };
    return colors[type] || '#666';
  }
  
  function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        toggleModal(modal.id, false);
      });
    });
    
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          toggleModal(modal.id, false);
        }
      });
    });
  }
  
  function setupEventListeners() {
    // Copy SQL button
    document.getElementById('copy-sql-btn')?.addEventListener('click', () => {
      const sql = document.getElementById('sql-output').textContent;
      navigator.clipboard.writeText(sql);
      showToast('SQL copied to clipboard', 'success');
    });
  }
  
  function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
      modal.classList.add('active');
    } else {
      modal.classList.remove('active');
    }
  }
  
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => container.removeChild(toast), 300);
    }, 5000);
    
    // Manual close
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => container.removeChild(toast), 300);
    });
  }
  
  function formatDateTime(date) {
    return new Date(date).toLocaleString();
  }
  
  function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
  
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  function saveQuery() {
    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) {
      showToast('Please enter a query to save', 'warning');
      return;
    }
    
    // Add to query history
    const newQuery = {
      id: 'q' + Date.now(),
      prompt: prompt,
      sql: document.getElementById('sql-output').textContent,
      database: document.getElementById('query-db-selector').value || 'All Databases',
      timestamp: new Date().toISOString(),
      status: 'saved',
      rows: 0
    };
    
    appData.queryHistory.unshift(newQuery);
    
    // Update query history sidebar
    const sidebar = document.getElementById('query-history-sidebar');
    sidebar.insertBefore(createQueryHistoryItem(newQuery), sidebar.firstChild);
    
    showToast('Query saved successfully', 'success');
  }
  
  function suggestPipeline() {
    const suggestions = [
      "Create a daily pipeline that extracts customer data from SQL Server, transforms it in Snowflake, and loads it into Databricks for ML training",
      "Set up an hourly sync from Salesforce to Snowflake for real-time analytics",
      "Migrate historical data from Oracle to PostgreSQL with data validation",
      "Create a weekly pipeline that aggregates sales data from multiple sources into a unified dashboard"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    document.getElementById('pipeline-prompt').value = randomSuggestion;
    showToast('Pipeline suggestion loaded', 'info');
  }
}); 

// Interactive SVG Data Flow Diagram
function setupPromptELTFlowDiagram() {
  const svg = document.getElementById('promptelt-flow-svg');
  if (!svg) return;
  const tooltip = document.getElementById('flow-tooltip');
  const nodeData = {
    'central-node': {
      label: 'PromptELT',
      desc: 'PromptELT: Your Unified SQL Data Access Layer. Query anything, anywhere.'
    },
    'mssql-node': {
      label: 'MSSQL',
      desc: 'Microsoft SQL Server: Enterprise-grade transactional and analytical data.'
    },
    'oracle-node': {
      label: 'Oracle',
      desc: 'Oracle Database: Mission-critical workloads and advanced analytics.'
    },
    'postgres-node': {
      label: 'Postgres',
      desc: 'PostgreSQL: Open-source, extensible relational database.'
    },
    'salesforce-node': {
      label: 'Salesforce',
      desc: 'Salesforce Database: Your CRM data, instantly accessible for comprehensive customer insights.'
    },
    'snowflake-node': {
      label: 'Snowflake',
      desc: 'Snowflake Database: Unify your cloud data warehouse analytics with external sources.'
    },
    'databricks-node': {
      label: 'Databricks',
      desc: 'Databricks Lakehouse: Integrate your raw and refined data from the lakehouse for powerful AI/ML and analytics.'
    }
  };
  // Animate central node
  const centralCircle = svg.querySelector('.central-node circle');
  if (centralCircle) {
    centralCircle.animate([
      { filter: 'drop-shadow(0 0 0px #21808d)' },
      { filter: 'drop-shadow(0 0 32px #21808d)' },
      { filter: 'drop-shadow(0 0 0px #21808d)' }
    ], {
      duration: 2000,
      iterations: Infinity
    });
  }
  // Animate lines (pulse effect)
  svg.querySelectorAll('.flow-line').forEach(line => {
    line.animate([
      { strokeDasharray: '0,1000', opacity: 0.7 },
      { strokeDasharray: '20,1000', opacity: 1 },
      { strokeDasharray: '0,1000', opacity: 0.7 }
    ], {
      duration: 1800,
      iterations: Infinity
    });
  });
  // Tooltip logic
  function showTooltip(evt, text) {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (evt.clientX + 18) + 'px';
    tooltip.style.top = (evt.clientY - 10) + 'px';
  }
  function hideTooltip() {
    tooltip.style.display = 'none';
  }
  // Add hover events
  Object.keys(nodeData).forEach(nodeClass => {
    const node = svg.querySelector('.' + nodeClass);
    if (node) {
      node.addEventListener('mousemove', (evt) => {
        showTooltip(evt, nodeData[nodeClass].desc);
        // Highlight line if not central
        if (nodeClass !== 'central-node') {
          const lineId = 'line-' + nodeClass.replace('-node', '');
          const line = svg.getElementById(lineId);
          if (line) line.setAttribute('stroke-width', '8');
        }
        if (nodeClass === 'central-node') {
          centralCircle.setAttribute('stroke', '#fff');
          centralCircle.setAttribute('stroke-width', '5');
        }
      });
      node.addEventListener('mouseleave', () => {
        hideTooltip();
        if (nodeClass !== 'central-node') {
          const lineId = 'line-' + nodeClass.replace('-node', '');
          const line = svg.getElementById(lineId);
          if (line) line.setAttribute('stroke-width', '4');
        }
        if (nodeClass === 'central-node') {
          centralCircle.removeAttribute('stroke');
          centralCircle.removeAttribute('stroke-width');
        }
      });
    }
  });
} 