import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private data = [
    {
      title: 'History of Philosophy',
      query: 'History of philosophy',
      response: 'Some response about the history of philosophy',
      queries: [
        {
          title: 'Ancient Philosophy',
          query: 'Tell me more about ancient philosophy',
          response: '...',
          queries: [],
        },
        {
          title: 'Modern Philosophy',
          query: 'Tell me more about modern philosophy',
          response: 'some rather brief response',
          queries: [],
        },
      ],
    },
    {
      title: 'Quantum Mechanics',
      query: 'Quantum mechanics',
      response: 'Some response about quantum mechanics',
      queries: [
        {
          title: 'Double-Slit Experiment',
          query: 'Explain the double-slit experiment',
          response: 'Some response about the double-slit experiment',
          queries: [
            {
              title: 'Wave-Particle Duality',
              query: 'What is wave-particle duality?',
              response: 'Some response about wave-particle duality',
              queries: [],
            },
          ],
        },
      ],
    },
    {
      title: 'Artificial Intelligence',
      query: 'Artificial Intelligence',
      response: 'Some response about artificial intelligence',
      queries: [
        {
          title: 'Machine Learning',
          query: 'What is machine learning?',
          response: 'Some response about machine learning',
          queries: [
            {
              title: 'Supervised Learning',
              query: 'Explain supervised learning',
              response: 'Some response about supervised learning',
              queries: [],
            },
            {
              title: 'Unsupervised Learning',
              query: 'Explain unsupervised learning',
              response: 'Some response about unsupervised learning',
              queries: [],
            },
          ],
        },
      ],
    },
    {
      title: 'Climate Change',
      query: 'Climate Change',
      response: 'Some response about climate change',
      queries: [
        {
          title: 'Causes of Climate Change',
          query: 'What are the causes of climate change?',
          response: 'Some response about the causes of climate change',
          queries: [],
        },
        {
          title: 'Effects of Climate Change',
          query: 'What are the effects of climate change?',
          response: 'Some response about the effects of climate change',
          queries: [
            {
              title: 'Sea Level Effects',
              query: 'How does climate change affect sea levels?',
              response: 'Some response about sea levels',
              queries: [],
            },
          ],
        },
      ],
    },
    {
      title: 'Blockchain Technology',
      query: 'Blockchain Technology',
      response: 'Some response about blockchain technology',
      queries: [
        {
          title: 'What is Blockchain',
          query: 'What is a blockchain?',
          response: 'Some response about what a blockchain is',
          queries: [],
        },
        {
          title: 'Smart Contracts',
          query: 'What are smart contracts?',
          response: 'Some response about smart contracts',
          queries: [
            {
              title: 'How Smart Contracts Work',
              query: 'How do smart contracts work?',
              response: 'Some response about how smart contracts work',
              queries: [],
            },
          ],
        },
      ],
    },
  ];

  getData() {
    return this.data;
  }
}
