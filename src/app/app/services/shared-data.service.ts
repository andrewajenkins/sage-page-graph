import { EventEmitter, Injectable } from '@angular/core';
import { Conversation } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private _currentPath: number[] = [];
  get currentPath(): number[] {
    return this._currentPath;
  }
  set currentPath(value: number[]) {
    this._currentPath = value;
  }
  queryAppended = new EventEmitter<void>();

  private data = [
    {
      title: 'Double-Slit Experiment',
      query: 'Explain the double-slit experiment',
      response:
        'The double-slit experiment is a demonstration that light and matter can display characteristics of both classically defined waves and particles. It was first performed by Thomas Young in 1801. The experiment involves shining a light through two closely spaced slits and observing the resulting pattern on a screen. The pattern shows interference fringes, which are characteristic of waves, even when particles (such as electrons) are sent through the slits one at a time.',
      queries: [
        {
          title: 'Wave-Particle Duality',
          query: 'What is wave-particle duality?',
          response:
            'Wave-particle duality is the concept in quantum mechanics that every particle or quantum entity can exhibit both wave-like and particle-like properties. This duality is a fundamental aspect of quantum mechanics and is best illustrated by the double-slit experiment. When particles such as electrons are not observed, they exhibit wave-like behavior, creating an interference pattern. However, when they are observed, they behave like particles, hitting the screen at discrete points.',
          queries: [],
        },
      ],
    },
    {
      title: 'Artificial Intelligence',
      query: 'Artificial Intelligence',
      response:
        'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions), and self-correction. AI applications include expert systems, natural language processing (NLP), speech recognition, and machine vision.',
      queries: [
        {
          title: 'Machine Learning',
          query: 'What is machine learning?',
          response:
            'Machine learning is a subset of artificial intelligence that involves the use of algorithms and statistical models to enable computers to perform specific tasks without using explicit instructions. It relies on patterns and inference instead. Machine learning algorithms build a model based on sample data, known as training data, to make predictions or decisions without being explicitly programmed to perform the task.',
          queries: [
            {
              title: 'Supervised Learning',
              query: 'Explain supervised learning',
              response:
                'Supervised learning is a type of machine learning where the model is trained on labeled data. This means that each training example is paired with an output label. The algorithm learns to map inputs to the desired output by finding patterns in the training data. Common algorithms used in supervised learning include linear regression, logistic regression, and support vector machines.',
              queries: [],
            },
            {
              title: 'Unsupervised Learning',
              query: 'Explain unsupervised learning',
              response:
                'Unsupervised learning is a type of machine learning where the model is trained on unlabeled data. The algorithm tries to learn the patterns and the structure from the input data without any explicit instructions on what to predict. Common techniques used in unsupervised learning include clustering (e.g., k-means, hierarchical clustering) and association (e.g., Apriori algorithm).',
              queries: [],
            },
          ],
        },
      ],
    },
    {
      title: 'Climate Change',
      query: 'Climate Change',
      response:
        'Climate change refers to significant changes in global temperatures and weather patterns over time. While climate change is a natural phenomenon, scientific evidence shows that human activities, particularly the burning of fossil fuels and deforestation, have been the primary drivers of climate change since the mid-20th century. These activities increase the concentration of greenhouse gases in the atmosphere, leading to global warming and other climatic changes.',
      queries: [
        {
          title: 'Causes of Climate Change',
          query: 'What are the causes of climate change?',
          response:
            'The primary causes of climate change are the burning of fossil fuels, such as coal, oil, and natural gas, which releases carbon dioxide (CO2) and other greenhouse gases into the atmosphere. Deforestation, industrial processes, and some agricultural practices also contribute to the increase in greenhouse gases. These gases trap heat in the atmosphere, leading to a warming effect known as the greenhouse effect.',
          queries: [],
        },
        {
          title: 'Effects of Climate Change',
          query: 'What are the effects of climate change?',
          response:
            'The effects of climate change are widespread and significant. They include rising sea levels, more frequent and severe weather events (such as hurricanes, heatwaves, and heavy rainfall), changes in precipitation patterns, and disruptions to ecosystems and biodiversity. Climate change also poses risks to human health, food security, water supply, and economic stability.',
          queries: [
            {
              title: 'Sea Level Effects',
              query: 'How does climate change affect sea levels?',
              response:
                'Climate change affects sea levels through two main processes: thermal expansion and the melting of ice. As global temperatures rise, seawater warms and expands, contributing to higher sea levels. Additionally, the melting of glaciers and ice sheets in Greenland and Antarctica adds more water to the oceans. Rising sea levels can lead to coastal erosion, increased flooding, and the loss of habitat for plants, animals, and even humans.',
              queries: [],
            },
          ],
        },
      ],
    },
    {
      title: 'Quantum Computing',
      query: 'What is quantum computing?',
      response:
        'Quantum computing is a type of computing that takes advantage of the quantum states of subatomic particles to store information. Unlike classical computers, which use bits as the smallest unit of data, quantum computers use quantum bits or qubits. Qubits can represent and store more complex information than classical bits because they can exist in multiple states simultaneously, thanks to the principles of superposition and entanglement.',
      queries: [
        {
          title: 'Superposition',
          query: 'What is superposition in quantum computing?',
          response:
            'Superposition is a fundamental principle of quantum mechanics that allows particles to exist in multiple states at once. In quantum computing, this means that a qubit can represent both 0 and 1 simultaneously, unlike a classical bit which can only be either 0 or 1. This property enables quantum computers to process a vast amount of information simultaneously, making them potentially much more powerful than classical computers for certain tasks.',
          queries: [
            {
              title: 'Quantum Gates',
              query: 'What are quantum gates?',
              response:
                'Quantum gates are the basic building blocks of quantum circuits, similar to classical logic gates in conventional computing. They manipulate qubits through operations that change their state. Quantum gates are reversible and can perform complex operations by taking advantage of superposition and entanglement. Common quantum gates include the Hadamard gate, the Pauli-X gate, and the CNOT gate.',
              queries: [
                {
                  title: 'Hadamard Gate',
                  query: 'Explain the Hadamard gate',
                  response:
                    'The Hadamard gate is a one-qubit quantum gate that creates a superposition state from a classical bit state. When applied to a qubit, it transforms the qubit into an equal superposition of 0 and 1. This gate is essential for creating quantum parallelism and is often used at the beginning of quantum algorithms to prepare qubits in a superposition state.',
                  queries: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Blockchain Technology',
      query: 'What is blockchain technology?',
      response:
        'Blockchain technology is a decentralized digital ledger that records transactions across many computers in such a way that the registered transactions cannot be altered retroactively. This technology underpins cryptocurrencies like Bitcoin and has potential applications in various fields, including finance, supply chain management, and voting systems. Each block in a blockchain contains a list of transactions, and once a block is completed, it is added to the chain in a linear, chronological order.',
      queries: [
        {
          title: 'Cryptography in Blockchain',
          query: 'How is cryptography used in blockchain?',
          response:
            'Cryptography is fundamental to blockchain technology. It ensures the security and integrity of data stored on the blockchain. Public-key cryptography is used to create digital signatures, which verify the authenticity of transactions. Hash functions are used to link blocks together, ensuring that any alteration to a block would change its hash and break the chain, making tampering evident.',
          queries: [
            {
              title: 'Hash Functions',
              query: 'What are hash functions in blockchain?',
              response:
                "Hash functions are mathematical algorithms that take an input and produce a fixed-size string of characters, which appears random. In blockchain, hash functions are used to create a unique identifier for each block. This identifier, or hash, is based on the block's contents and the hash of the previous block, linking them together. This ensures the immutability of the blockchain, as any change in a block's data would result in a different hash, breaking the chain.",
              queries: [
                {
                  title: 'SHA-256',
                  query: 'Explain SHA-256',
                  response:
                    'SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a 256-bit hash value. It is widely used in blockchain technology, particularly in Bitcoin, to ensure data integrity and security. SHA-256 takes an input and produces a fixed-size string of characters, which is unique to the input data. Even a small change in the input will produce a significantly different hash, making it a reliable method for verifying data integrity.',
                  queries: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  getData() {
    return this.data;
  }

  getChatHistory(): any[] {
    let queriesList = this.data;
    const chatHistory = [];
    for (const index of this.currentPath) {
      chatHistory.push(queriesList[index]);
      queriesList = queriesList[index].queries;
    }
    return chatHistory;
  }

  getCurrentQueriesList(): any {
    let queriesList = this.data;
    for (const index of this.currentPath) {
      queriesList = queriesList[index].queries;
    }
    return queriesList;
  }

  appendQuery(query: any): void {
    const currentQueriesList = this.getCurrentQueriesList();
    console.log('Current queries list:', currentQueriesList);
    currentQueriesList.push(query);
    this.appendCurrentPath(currentQueriesList.length - 1);
    this.queryAppended.emit();
  }

  selectNode(path: number[]): void {
    this.currentPath = path;
  }

  getCurrentPath(): number[] {
    console.log('Getting current path:', this.currentPath);
    return this.currentPath;
  }

  appendCurrentPath(index: number): void {
    console.log('Appending current path:', this.currentPath);
    this.currentPath.push(index);
  }

  initializeDeepestConversation(): any[] {
    let queriesList = this.data[0];
    const path = [0];
    const chatHistory = [queriesList];

    while (queriesList.queries && queriesList.queries.length > 0) {
      queriesList = queriesList.queries[0];
      path.push(0);
      chatHistory.push(queriesList);
    }

    this.currentPath = path;
    return chatHistory;
  }

  reset(): void {
    this.currentPath = [];
  }

  getCurrentConversation(): Conversation {
    return this.data[this.currentPath[0]];
  }

  getConversationByIndex(index: number): Conversation {
    return this.data[index];
  }

  // New method to find the path by query
  findPathByQuery(
    data: any[],
    targetQuery: string,
    path: number[] = [],
  ): number[] {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const newPath = [...path, i];
      if (item.query === targetQuery) {
        return newPath;
      }
      if (item.queries && item.queries.length > 0) {
        const result = this.findPathByQuery(item.queries, targetQuery, newPath);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  }

  // New method to set the path by query
  setPathByQuery(targetQuery: string): void {
    const path = this.findPathByQuery(this.data, targetQuery);
    if (path.length > 0) {
      this.currentPath = path;
    } else {
      console.error('Query not found in data', this.data, targetQuery);
    }
  }
}
