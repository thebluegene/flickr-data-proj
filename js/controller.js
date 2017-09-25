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
          hour: i,
          count: 0,
          url: null
        });
      }
      return array;
    }

    function _getUrl(photo) {
      return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_c.jpg";
    }

    return {
      getShotsPerMonth: function(data) {
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
      getUrl: function(photo) {
        return _getUrl(photo);
      }
    };
  })();
