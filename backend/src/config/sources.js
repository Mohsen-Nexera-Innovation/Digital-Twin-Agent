export const SOURCES = [
  // --- Existing sources ---
  { name: 'TechCrunch AI', type: 'rss', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', enabled: true },
  { name: 'VentureBeat AI', type: 'rss', url: 'https://venturebeat.com/ai/feed/', enabled: true },
  { name: 'MIT Tech Review', type: 'rss', url: 'https://www.technologyreview.com/feed/', enabled: true },
  { name: 'The Verge AI', type: 'rss', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', enabled: true },
  { name: 'Wired AI', type: 'rss', url: 'https://www.wired.com/feed/tag/artificial-intelligence/latest/rss', enabled: true },
  { name: 'OpenAI Blog', type: 'rss', url: 'https://openai.com/blog/rss.xml', enabled: true },
  { name: 'Google AI Blog', type: 'rss', url: 'https://blog.google/technology/ai/rss/', enabled: true },
  { name: 'Hugging Face Blog', type: 'rss', url: 'https://huggingface.co/blog/feed.xml', enabled: true },
  { name: 'DeepMind Blog', type: 'rss', url: 'https://deepmind.google/blog/rss.xml', enabled: true },
  { name: 'HackerNews AI', type: 'hackernews', url: 'https://hn.algolia.com/api/v1/search', enabled: true },
  { name: 'ArXiv AI', type: 'arxiv', url: 'https://export.arxiv.org/api/query', params: { searchQuery: 'cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL', maxResults: 20 }, enabled: true },
  { name: 'Reddit ML', type: 'reddit', url: 'https://www.reddit.com/r/MachineLearning+artificial+singularity.json', enabled: true },

  // --- Latest AI News ---
  { name: 'Ars Technica AI', type: 'rss', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', enabled: true },
  { name: 'AI News', type: 'rss', url: 'https://www.artificialintelligence-news.com/feed/', enabled: true },
  { name: 'ZDNET AI', type: 'rss', url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', enabled: true },
  { name: 'Analytics Vidhya', type: 'rss', url: 'https://www.analyticsvidhya.com/feed/', enabled: true },

  // --- AI Agents (tutorials & guides) ---
  { name: 'LangChain Blog', type: 'rss', url: 'https://blog.langchain.dev/rss/', enabled: true },
  { name: 'Towards AI', type: 'rss', url: 'https://towardsai.net/feed', enabled: true },
  { name: 'Microsoft Semantic Kernel', type: 'rss', url: 'https://devblogs.microsoft.com/semantic-kernel/feed/', enabled: true },
  { name: 'LlamaIndex Blog', type: 'rss', url: 'https://blog.llamaindex.ai/feed', enabled: true },
  { name: 'Cohere Blog', type: 'rss', url: 'https://cohere.com/blog/rss', enabled: true },

  // --- Digital Twin (tutorials & industry guides) ---
  { name: 'NVIDIA Developer Blog', type: 'rss', url: 'https://developer.nvidia.com/blog/feed/', enabled: true },
  { name: 'IoT Analytics', type: 'rss', url: 'https://iot-analytics.com/feed/', enabled: true },
  { name: 'AWS IoT Blog', type: 'rss', url: 'https://aws.amazon.com/blogs/iot/feed/', enabled: true },
  { name: 'Digital Engineering', type: 'rss', url: 'https://www.digitalengineering247.com/feed/', enabled: true },
  { name: 'Azure IoT Blog', type: 'rss', url: 'https://techcommunity.microsoft.com/t5/internet-of-things-blog/bg-p/IoTBlog/rss-board-messages', enabled: true },

  // --- Data Science (beginner to advanced tutorials) ---
  { name: 'Towards Data Science', type: 'rss', url: 'https://towardsdatascience.com/feed', enabled: true },
  { name: 'KDnuggets', type: 'rss', url: 'https://www.kdnuggets.com/feed', enabled: true },
  { name: 'Machine Learning Mastery', type: 'rss', url: 'https://machinelearningmastery.com/feed/', enabled: true },
  { name: 'Real Python', type: 'rss', url: 'https://realpython.com/atom.xml', enabled: true },
  { name: 'freeCodeCamp Data', type: 'rss', url: 'https://www.freecodecamp.org/news/tag/data-science/rss/', enabled: true },
  { name: 'DataCamp Blog', type: 'rss', url: 'https://www.datacamp.com/blog.rss', enabled: true },

  // --- Machine Learning (beginner to advanced tutorials) ---
  { name: 'PyTorch Blog', type: 'rss', url: 'https://pytorch.org/blog/feed.xml', enabled: true },
  { name: 'TensorFlow Blog', type: 'rss', url: 'https://blog.tensorflow.org/feeds/posts/default', enabled: true },
  { name: 'fast.ai Blog', type: 'rss', url: 'https://www.fast.ai/feed.xml', enabled: true },
  { name: 'Distill', type: 'rss', url: 'https://distill.pub/rss.xml', enabled: true },
  { name: 'Weights & Biases', type: 'rss', url: 'https://wandb.ai/fully-connected/rss.xml', enabled: true },
  { name: 'Paperspace Blog', type: 'rss', url: 'https://blog.paperspace.com/rss/', enabled: true },
];
