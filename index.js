/*jshint esversion: 6 */

const App = {
  data() {
    return {
      recompute: Date.now(),
      data: [],
      search: false,
      page: 1,
      itemPerPage: 20,
      showAdvanceFilter: false,
      tableView: true,
      sort: false,
      sortDirection: 'asc',

      itemPerPages: [10,20,50,100],
      maxPage: 100,

      platforms: [],
      scores: [],
      genres: [],
      editorsChoice: [],

      filters: {
        'title': '',
        'platform': 'All',
        'genre': 'All',
        'editors_choice': 'All',
        'score': 'All',
      },
    };
  },

  computed: {
    pageItems() {
      this.recompute;
      var searchResult = [];
      const start = (this.page - 1) * this.itemPerPage;
      var end = start + this.itemPerPage;

      if (this.list.length < this.itemPerPage) {
        end = this.list.length;
      }

      searchResult = this.list.slice(start, end);
      return searchResult;
    },

    list() {
      this.recompute;
      var searchResult = this.data.filter((item) => {
        if (!item.title) {
          return false;
        }

        var include = true;
        Object.keys(this.filters).forEach((key) => {

          if (this.filters[key] === 'All') {
            include = include && true;
            return;
          }

          if (key === 'title') {
            const title = item[key].toLowerCase();
            const search = this.filters[key].toLowerCase().trim();

            if (search !== '') {
              if (title.indexOf(search) >= 0) {
                include = include && true;
                return;
              } else {
                include = include && false;
              }
            }

            include = include && true;
            return;
          }

          if (key === 'score') {
            include = include && item[key] === this.filters[key];
            return;
          }

          if (item[key] !== this.filters[key]) {
            include = false;
            return;
          }
        });

        return include;
      });

      this.maxPage = Math.ceil(searchResult.length / this.itemPerPage);

      if (this.sort === 'score') {
        searchResult.sort((itemA, itemB) => {
          if (this.sortDirection === 'asc') {
            return itemA.score < itemB.score ? -1 : 1;
          } else {
            return itemA.score > itemB.score ? -1 : 1;
          }
        });
      }

      if (this.sort === 'platform') {
        searchResult.sort((itemA, itemB) => {
          if (this.sortDirection === 'asc') {
            return itemA.platform.trim().toLowerCase() < itemB.platform.trim().toLowerCase() ? -1 : 1;
          } else {
            return itemA.platform.trim().toLowerCase() > itemB.platform.trim().toLowerCase() ? -1 : 1;
          }
        });
      }

      return searchResult;
    },

  },

  mounted() {
    axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json')
      .then((response) => {
        this.data = response.data;

        this.data.forEach((item) => {
          if (this.platforms.indexOf(item.platform) === -1) {
            this.platforms.push(item.platform);
          }

          if (this.scores.indexOf(item.score) === -1) {
            this.scores.push(item.score);
          }

          if (this.genres.indexOf(item.genre) === -1) {
            this.genres.push(item.genre);
          }

          if (this.editorsChoice.indexOf(item.editors_choice) === -1) {
            this.editorsChoice.push(item.editors_choice);
          }

        });

        ['platforms', 'genres', 'editorsChoice', 'scores'].forEach((key) => {
          this[key].sort();
          this[key].unshift('All');
        });

      });
  },

  methods: {
    selectFilter(type, value) {
      this.recompute = Date.now();
      this.filters[type] = value;
    },

    sortBy(column) {
      this.recompute = Date.now();

      if (!this.sort || this.sort !== column) {
        this.sort = column;
        this.sortDirection = 'asc';
        return;
      }

      if (this.sortDirection === 'desc') {
        this.sort = false;
        this.sortDirection = 'asc';
        return;
      }

      this.sort = column;
      this.sortDirection = 'desc';
    },
  }
}

Vue.createApp(App).mount('#app')
