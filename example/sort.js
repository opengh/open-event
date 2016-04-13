var sort = require('../sort')

module.exports = function () {
  return [
    [
      {start: 'Fri May 05 2017 13:10:00 GMT+0900', name: 'start 1 1'},
      {start: 'Fri May 05 2017 05:10:00 GMT+0800', name: 'start 1 2'},
      {start: 'Fri May 05 2017 10:10:00 GMT+0000', name: 'start 1 3'},
      {start: 'Fri May 05 2017 05:10:00 GMT+0800', name: 'start 1 4'}
    ].sort(sort.byStart()),
    [
      {start: 'Fri May 05 2017 13:10:00 GMT+0900', name: 'start -1 1'},
      {start: 'Fri May 05 2017 10:10:00 GMT+0000', name: 'start -1 2'},
      {start: 'Fri May 05 2017 05:10:00 GMT+0800', name: 'start -1 3'}
    ].sort(sort.byStart(-1)),
    [
      {
        name: 'end 1 1',
        start: 'Fri May 05 2017 13:10:00 GMT+0900',
        end: 'Fri May 05 2017 19:15:00 GMT+0900'
      },
      {
        name: 'end 1 2',
        start: 'Fri May 05 2017 10:10:00 GMT+0000'
        // Assumes end is equals start
      },
      {
        name: 'end 1 3',
        start: 'Fri May 05 2017 05:10:00 GMT+0800',
        end: 'Fri May 05 2017 06:10:00 GMT+0800'
      }
    ].sort(sort.byEnd()),
    [
      {
        name: 'end -1 1',
        start: 'Fri May 05 2017 05:10:00 GMT+0800',
        end: 'Fri May 05 2017 18:10:00 GMT+0800'
      },
      {
        name: 'end -1 2',
        start: 'Fri May 05 2017 13:10:00 GMT+0900',
        end: 'Fri May 05 2017 19:15:00 GMT+0900'
      },
      {
        name: 'end -1 3',
        start: 'Fri May 05 2017 10:10:00 GMT+0000'
        // Assumes end is equals start
      },
      {
        name: 'end -1 4',
        start: 'Fri May 05 2017 05:10:00 GMT+0800',
        end: 'Fri May 05 2017 06:10:00 GMT+0800'
      }
    ].sort(sort.byEnd(-1)),
    [
      {
        name: 'center 1 1',
        start: 'Fri May 05 2017 13:10:00 GMT+0900',
        end: 'Fri May 05 2017 22:15:00 GMT+0900',
        open: 'Fri May 05 2017 10:15:00 GMT+0900'
        // Center is halfway between open and end
      },
      {
        name: 'center 1 2',
        start: 'Fri May 05 2017 10:10:00 GMT+0000'
        // Center is at start
      },
      {
        name: 'center 1 3',
        start: 'Fri May 05 2017 09:10:00 GMT+0000',
        end: 'Fri May 05 2017 11:10:00 GMT+0000'
        // Center is at start
      },
      {
        name: 'center 1 4',
        start: 'Fri May 05 2017 05:10:00 GMT+0800',
        end: 'Fri May 05 2017 06:10:00 GMT+0800'
        // Center is halfway between start and end
      }
    ].sort(sort.byCenter()),
    [
      {
        name: 'center -1 1',
        start: 'Fri May 05 2017 05:10:00 GMT+0800',
        end: 'Fri May 05 2017 06:10:00 GMT+0800'
        // Center is halfway between start and end
      },
      {
        name: 'center -1 2',
        start: 'Fri May 05 2017 13:10:00 GMT+0900',
        end: 'Fri May 05 2017 22:15:00 GMT+0900',
        open: 'Fri May 05 2017 10:15:00 GMT+0900'
        // Center is halfway between open and end
      },
      {
        name: 'center -1 3',
        start: 'Fri May 05 2017 10:10:00 GMT+0000'
        // Center is at start
      }
    ].sort(sort.byCenter(-1)),
    [
      {
        name: 'open 1 1',
        start: 'Fri May 05 2017 10:15:00 GMT+0900'
        // Open is assumed at start
      },
      {
        name: 'open 1 2',
        start: 'Fri May 05 2017 13:10:00 GMT+0900',
        open: 'Fri May 05 2017 10:15:00 GMT+0900'
      },
      {
        name: 'open 1 3',
        start: 'Fri May 05 2017 10:10:00 GMT+0000'
        // Open is assumed at start
      },
      {
        name: 'open 1 4',
        start: 'Fri May 05 2017 14:10:00 GMT+0800',
        open: 'Fri May 05 2017 06:10:00 GMT+0800'
      }
    ].sort(sort.byOpen()),
    [
      {
        name: 'open -1 1',
        start: 'Fri May 05 2017 13:10:00 GMT+0900',
        open: 'Fri May 05 2017 10:15:00 GMT+0900'
      },
      {
        name: 'open -1 2',
        start: 'Fri May 05 2017 10:10:00 GMT+0000'
        // Open is assumed at start
      },
      {
        name: 'open -1 3',
        start: 'Fri May 05 2017 14:10:00 GMT+0800',
        open: 'Fri May 05 2017 06:10:00 GMT+0800'
      }
    ].sort(sort.byOpen(-1))
  ]
}
