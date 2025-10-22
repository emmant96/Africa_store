# 🪡 Adire Threads – Serverless African Fashion Store

A **serverless e-commerce project** showcasing AWS skills by **Gbemileke Tobi Oyeniran & Abdul-azeez Ajobo**.  
It features an African-themed clothing store built entirely on the **AWS Free Tier**.

---

## 🌍 Architecture
User → CloudFront (HTTPS) → S3 (Frontend) → API Gateway → Lambda → DynamoDB → CloudWatch

---

## ⚙️ Tech Stack
- **Frontend:** HTML, Tailwind CSS, Vanilla JS, Lucide Icons  
- **Backend:** AWS Lambda (Python 3.12), API Gateway  
- **Database:** DynamoDB (Products + Orders tables)  
- **Hosting:** S3 Static Website + CloudFront CDN  
- **Monitoring:** CloudWatch Logs  

---

## 🧠 Learning Objectives
- Understand serverless architecture and cost optimization  
- Build REST APIs using AWS Lambda and API Gateway  
- Store and retrieve data with DynamoDB  
- Configure CORS and HTTPS with CloudFront  

---

## 🚀 Deployment Steps
1. **Upload Frontend**  
   - Create an S3 bucket, enable *Static Website Hosting*, upload `frontend` folder.

2. **Create DynamoDB Tables**  
   - `Products` → key: `id`  
   - `Orders` → key: `orderId`

3. **Deploy Lambda Function**  
   - Create Lambda from `lambda_function.py`, runtime Python 3.12.  
   - Add `AmazonDynamoDBFullAccess` policy to its IAM role.

4. **Create API Gateway**  
   - `GET /products` → Lambda integration  
   - `POST /orders` → Lambda integration  
   - Enable CORS and deploy.

5. **Connect Frontend**  
   - Replace `API_URL` in `script.js` with your API Gateway URL.

6. **Add CloudFront Distribution**  
   - Origin: your S3 static website.  
   - Enable HTTPS (default certificate).

---

## 👨🏽‍💻 Authors
**Gbemileke Tobi Oyeniran**  
**Abdul-Azeez Ajobo**  
Cloud DevOps Engineer & Data Analyst  
📧 oyeniranemmanuel@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/gbemilekeoyeniran) | [GitHub](https://github.com/emmant96)

---

## 🧾 License
Free to use for educational and portfolio purposes.
