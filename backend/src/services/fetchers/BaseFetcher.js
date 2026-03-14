export class BaseFetcher {
  constructor(source) {
    this.source = source;
  }

  async fetch() {
    throw new Error('fetch() must be implemented by subclass');
  }

  normalize(rawItem) {
    return {
      guid: null,
      title: null,
      url: null,
      content: null,
      author: null,
      published_at: null,
      source_name: this.source.name,
      image_url: null,
      categories: [],
      tags: [],
    };
  }
}
