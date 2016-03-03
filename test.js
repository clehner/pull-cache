var test = require('tape')
var cache = require('.')
var pull = require('pull-stream')

var vals = [1,2,3,4,5,4,'foo',null,Object()]

test.Test.prototype.streamEquals = function (source, values, msg) {
  this.test(msg, function (t) {
    pull(source, pull.collect(function (err, arr) {
      t.error(err, 'collect')
      t.deepEquals(arr, values, 'values')
      t.end()
    }))
  })
}

test('cached source reads the same data as underlying source', function (t) {

  t.streamEquals(pull.values(vals), vals, 'pass through')

  var sourceCache = pull(pull.values(vals), cache)
  t.streamEquals(sourceCache(), vals, 'cache one')
  t.streamEquals(sourceCache(), vals, 'cache two')
  t.streamEquals(sourceCache(), vals, 'cache three')
})

test('aborting cached source does not abort other sources', function (t) {
  var sourceCache = pull(pull.values(vals), cache)
  t.streamEquals(pull(sourceCache(), pull.take(3)), vals.slice(0, 3),
    'cache early end')
  t.streamEquals(sourceCache(), vals, 'cache')
})

test('stream end is propagated to cached sources', function (t) {
  t.plan(4)
  var sourceCache = pull(pull.error('end'), cache)

  pull(sourceCache(), pull.collect(function (err, vals) {
    t.equals(err, 'end', 'end 1')
    t.deepEquals(vals, [], 'no values 1')
  }))

  pull(sourceCache(), pull.collect(function (err, vals) {
    t.equals(err, 'end', 'end 2')
    t.deepEquals(vals, [], 'no values 2')
  }))
})
