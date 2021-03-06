// ローカルストレージ利用
// StorageAPIを利用するための準備　
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app = new Vue({
  el: '#app',
  data: {
    todos: [],
    options: [
      { value: -1, label: '全て'},
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' },
    ],
    // 選択中のvalueデータ 初期値は-1
    current : -1
  },

  methods: {
    doAdd: function(event, value){
      // 入力コメント取得
      var comment = this.$refs.comment
      if (!comment.value.length) {
        // 入力なしの場合は何もしない
        return
      }

      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })

      // 更新後、フォームの要素を殻にする
      comment.value = ""
    },

    // 状態変更処理
    doChangeState: function(item){
      item.state = item.state ? 0 : 1
    },

    doRemove: function(item){
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  },

  watch: {
    todos:{
      handler: function(todos) {
        todoStorage.save(todos)
      },
      // ネストデータも監視
      deep: true
    }
  },
  
  created() {
    this.todos = todoStorage.fetch()
  },
  
  computed: {
    computedTodos: function() {
      return this.todos.filter(function(el){
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
    },

  },


})