let dataFormatter = (function () {
    let shotPerMonth = [];

    function _searchInArray(arr, query) {
      let isTrue = false;
      arr.forEach( function(item, index) {
        if(item[0] == query) {
          isTrue = true;
        }
      });
      return isTrue;
    }

    function _addToKey(arr, query) {
      arr.forEach( function(item, index) {
        if(item[0] == query) {
          item[1]++;
        }
      });
    }

    function _sortByDate(a, b) {
      let aDate = new Date(+a[0].split('-')[0], +a[0].split('-')[1] - 1);
      let bDate = new Date(+b[0].split('-')[0], +b[0].split('-')[1] - 1);

      if(aDate == bDate) {
        return 0;
      }
      else {
        return aDate-bDate;
      }
    }

    function _createHoursArray() {
      let array = [];
      for(let i = 0; i < 24; i++) {
        array.push({
          type: i,
          count: 0,
          url: null
        });
      }
      return array;
    }

    function _createDaysArray() {
      let array = [];
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for(let i = 0; i < days.length; i++) {
        array.push({
          type: days[i],
          count: 0
        });
      }
      return array;
    }

    function _createMonthsArray() {
      let array = [];
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']
      for(let i = 0; i < months.length; i++) {
        array.push({
          type: months[i],
          count: 0
        });
      }
      return array;
    }

    function _getUrl(photo, size) {
      if(size == 'small') {
        return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_n.jpg";
      } else {
        return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_c.jpg";
      }
    }

    return {
      getChronologicalShotsPerMonth: function(data) {
        data.forEach( function(item){
          if(item['date-taken'] !== 'null') {
            let query = item['date-taken'].split(':').splice(0,2).join('-');
            let innerSet = [];
            if(shotPerMonth.length > 0 && _searchInArray(shotPerMonth, query)) {
              _addToKey(shotPerMonth, query);
            } else {
              innerSet.push(query);
              innerSet.push(1);
              shotPerMonth.push(innerSet);
            }
          }
        });
        shotPerMonth.sort(_sortByDate);
        return shotPerMonth;
      },
      getChronologicalShotsPerDay: function(data) {
        let count = 0;
        let set = [];
        let strictIsoParse = d3.timeParse("%Y:%m:%d %H:%M:%S");
        data.forEach(function(item) {
          count++;
          set.push({date: strictIsoParse(item['date-taken']), total: count, url: _getUrl(item, 'small')});
        });
        return set;
      },
      getShotsPerHour: function(data) {
        let hoursArray = _createHoursArray();
        let hour;
        data.forEach(function(item) {
          hour = parseInt(item['date-taken'].split(' ')[1].split(':')[0]);
          hoursArray[hour].count++;
          hoursArray[hour].url = _getUrl(item);
        });
        return hoursArray;
      },
      getShotsPerDay: function(data) {
        let dayArray = _createDaysArray();
        let day;
        data.forEach(function(item) {
          var d = new Date(item['date-taken'].split(' ')[0].replace(':','-'));
          day = d.getDay();
          dayArray[day].count++;
        });
        return dayArray;
      },
      getShotsPerMonth: function(data) {
        let monthArray = _createMonthsArray();
        let month;
        data.forEach(function(item) {
          var d = new Date(item['date-taken'].split(' ')[0].replace(':','-'));
          month = d.getMonth();
          monthArray[month].count++;
        });
        return monthArray;
      },
      getUrl: function(photo) {
        return _getUrl(photo);
      },
      getDataArray: function(data, dataType) {
        let dataArray = {};

        data.forEach(function(d) {
          if(d[dataType] != 0 && d[dataType] != 'null') {
            if(d[dataType] in dataArray) {
              dataArray[d[dataType]]++;
            } else {
              dataArray[d[dataType]] = 1;
            }
          }
        });

        return dataArray;
      }
    };
  })();
