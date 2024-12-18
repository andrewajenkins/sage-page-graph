# **Sage Page Graph:** A Conversational Graph Chatbot

## **Overview**
Sage Page is a next-generation chatbot application designed to handle dynamic, branching conversations. Unlike traditional chatbots that rely solely on linear dialogue, this system tracks the context of conversations using a graph-based structure, enabling users to explore multiple conversational paths seamlessly. 

Built with a powerful combination of **Angular**, **Django**, **Nginx**, and **Docker** on **AWS EC2**, this application leverages OpenAI's GPT-4 API to deliver intelligent, context-aware responses in real time.

---

## **Key Features**
### **1. Conversational Graph Structure**
- **Dynamic Context Management**: Tracks conversations as a graph with parent-child relationships between messages.
- **Branching Support**: Allows users to revisit any point in the conversation and branch into new topics without losing context.
- **Flexible Query Paths**: Handles multiple query/response paths within a single conversation.

### **2. Real-Time Chat Experience**
- **Frontend**: An interactive Angular interface optimized for speed and usability.
- **Backend**: Django handles message processing, database storage, and API communication.
- **API Integration**: Utilizes OpenAI's GPT-4 to generate intelligent and contextually aware responses.

### **3. Robust Backend Infrastructure**
- **Dockerized Deployment**: All components, including Redis, Postgres, Nginx, and the chatbot backend, are containerized for portability and scalability.
- **AWS EC2 Hosting**: Deployed on AWS EC2 for reliable performance and scalability.
- **Database-Driven Conversations**: Uses PostgreSQL to persist conversation data, including parent-child relationships for the graph.

### **4. User-Centric Design**
- **Session Tracking**: Retains conversational state across user sessions for a personalized experience.
- **Graphical Conversation Navigation**: Provides an intuitive way to view and manage branching conversation paths.

---

## **Use Cases**
### **Knowledge Exploration**
Users can explore complex topics by branching conversations into multiple paths, enabling deep dives into specific queries while retaining the ability to revisit and expand previous discussions.

### **Research Assistance**
Ideal for researchers and students, the chatbot can track the progression of exploratory queries and help refine ideas through dynamic interactions.

### **Customer Support**
Businesses can deploy the chatbot to manage non-linear customer support workflows, allowing customers to revisit and branch off earlier queries seamlessly.

---

## **Technologies Used**
- **Frontend**: Angular with PrimeNG for responsive, dynamic user interfaces.
- **Backend**: Django for robust API handling and database management.
- **Database**: PostgreSQL to store conversation trees.
- **Caching**: Redis for efficient session management and quick data retrieval.
- **Infrastructure**: Docker for containerization and Nginx for serving static assets and reverse proxy.
- **AI Integration**: OpenAI GPT-4 for natural language processing.

---

## **Why It Stands Out**
Sage Page combines state-of-the-art AI capabilities with an innovative graph-based approach to dialogue management. Its ability to navigate and build branching conversations makes it uniquely suited for applications requiring non-linear context retention. The architecture emphasizes performance, scalability, and user experience, making it a standout project in the field of conversational AI.

---

## **Future Enhancements**
- **Multimodal Support**: Incorporate image and file processing alongside text-based interactions.
- **Advanced Visualization**: Develop more interactive visual tools to explore conversation graphs.
- **PKM Integration**: Automatically build personal knowledge graphs from conversations.
- **Export**: Export conversation graphs to PDF, Markdown, or other formats for sharing and archiving.

---

## **Live Demo**
https://drive.google.com/file/d/1MAQdHy0B7Rpelml0gNmNB31U0_u-dVyI/view?usp=sharing

