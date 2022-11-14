import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http:HttpClient) { }

  newsDetailSubject = new Subject();
  addLocSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('searched_locations')))
  token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2IiwianRpIjoiYzIyMzQ3ODExNGE0ZmM1YzZhNGRmMWQ3ZTQ2OWI4Zjg0YTQwZDZhNmE1MDM2YWQyMzkwM2QwZjM2NDkxZDAyNTY4NGNmYTI3YmMxODIwYzEiLCJpYXQiOjE2NTM0NjA1NDMsIm5iZiI6MTY1MzQ2MDU0MywiZXhwIjoxNjg0OTk2NTQzLCJzdWIiOiIiLCJzY29wZXMiOltdfQ.3b5msdLvkEKD2GAwRDAOZzbn6Ym8NonGXnhYvnf8KgMoF-F591_jD_1NTFsqs22TPYNpcnMJWJlJEbJ2PIMOdoUMG0UXxgNNMr3KFiyiJDCzjdTFv0m11_w98KLKJVbmrtLXcevLlW6533MRhGsV8LStYf2V6PWiPlGadXZFZtgr7ImJ_Zbk7RY4wbLzZs_8ftMIiucr7cuYTeK79srZbi44Z0-47rYMA23rP5KX8uA2vM9ChODDUyLcrWE8ZOTxUnHUghQ-qmVqIquqesbtaJiXHmv5pMDVZaXbxWDDdAUhey_6VKvjKhxoL-W6YqUgUjF3Hsiry0q3NgJ39eYquudsB8WscdpPR0yqEaT_Lll_U3YPq5JJvCgRiERWHaQwNgN85T4YVtRVJwniJX7mfAtyfGoHJMwJKfKAatX2a8enG65tUonqveBfUr2GctgbkTEdznFKld97rKu673--FA9vHXuZEPE64iVsjkw0V1oYAKMT8vZIN_jXFhEdZ5nYEe-JYuKVq4eJ7sQ96cjy_jDD8z7ue6_itSxJwEWkbhq1zQbX2aoCuYXCS3QEHT-c8nH6Z1rfnGjImx4LBbXNUwrS9UciTl3kDJ11PckJzwxjeKnGQ8gwWFBdi5vftX2p6lrDNSo1Wa0reKmdb9_OSEkyyHmN_coCSc68U5PyA3s';
  getFlood(): Observable<any> {
    return this.http.get('https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=roadjson');
  }

  headers = new HttpHeaders({'Authorization': this.token});
  getDataByLatLng(lat,lng): Observable<any> {
    return this.http.get(`https://api.skymetweather.com/v1/dashboard?latlon=${lat},${lng}`,{headers:this.headers})
  }
  getDataById(id): Observable<any> {
    return this.http.get(`https://api.skymetweather.com/v1/dashboard?id=${id}`,{headers:this.headers})
  }


  newsStories(endpoint):Observable<any> {
    const authToken ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2IiwianRpIjoiN2RjNDcxNWQ4NTQ3OTMzY2MzNWMwNzM4ODdiN2U4NTRkMzdlMTIyZmVmMzM4NzYyNzUwYjRjYjIxMTJhYTRlMGFkNTc4MDljNWI1NmZhYzciLCJpYXQiOjE2NTY1MTQ0MzIsIm5iZiI6MTY1NjUxNDQzMiwiZXhwIjoxNjg4MDUwNDMyLCJzdWIiOiIiLCJzY29wZXMiOltdfQ.JQ40dcKlqmFNkaM0guuyyF5WoC6dfYIzoM0HTuaP_Ps4rJZPxL3mEG_vuqmMkRJu5qHsjyRZhcxKIU4ZJZHffqP1zrROto4-IuTxwYhTmEBi9Ym0gK5k5XyHyGY4wU4x_0DVvcNafnHc2Sx7esyd-1ivGbvgI2KQl7TzDOEjSZh4rpVbm1D4bDST5OcC9wqXDhltf_bv3PJKtkUnbzrMUWpcrzEOuPkH4Kjn79U84PF5oZeyM_mPIC8qbDeI9XSizbc_G9wrUXE-rKLyBG9-v4dzPyNuR9FA2kYG2aoZyEM4Q9vVTJN0ifl_BwSqTaaFlPeQHOiNOysspfd3Curfx-FMAJIDpKjNBFdye0LaXLNaRoxW28UmBrYizJY7C0KDBUx3adQ59P0u2NXZRY1GtdU2hW-AHZNvkePs9kxVuf-EmkEw7D0PCh1EB6rVq4IyxCTHHynLEt34FslqgwPykHF5XrsFYl9kD3TJ32N4nTi5raZycazJP2wv0xfs4MQbR6z-8e2KBGdnDgb1Dk8SXCk_Ee5dSzpzV1wF_4GU3YVUqT3yN2wQeDqQATEY6H_fNhmN4eTfB_71H7UDIDmnFDNqGupx07sNh3hnd3UyLxVMFuSKKzqgjc2gZF9ppz1_lJCthEP7VxUIqgnBGzPYjYoz8U-1chkP4_xsTTyoPyw'
    const headers = new HttpHeaders({'Authorization': authToken});
    return this.http.get(`https://api.skymetweather.com/v1/`+endpoint,{headers})
  
  }

  getDashboardData(id): Observable<any> {
    const header = new HttpHeaders({
      'Authorization':this.token
    })
    return this.http.get(`https://api.skymetweather.com/v1/forecast-detail/${id}?limit=15`,{headers:header})
  }

  getForecastData(id,limit): Observable<any> {
    const header = new HttpHeaders({
      'Authorization':this.token
    })
    return this.http.get(`https://api.skymetweather.com/v1/forecast-detail/${id}?limit=${limit}`,{headers:header})
  }

  getRain(hr?): Promise<any> {
   return this.http.get(`https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=rainjson&hr=${hr ? hr :''}`).toPromise()
    //return this.http.get(`https://www.skymetweather.com/flood/json/MH_rain_${hr ? hr :''}.json`).toPromise();
      //return this.http.get(`assets/json/rain0.json`).toPromise();
    
  }
  

  mumbaiLatLng():Observable<any> {
    const header = new HttpHeaders({
      'Authorization':this.token
    })
    return this.http.get(`https://api.skymetweather.com/v1/mumbai-alldata-fixedlocations?latlon=26.08743414,83.29488407`,{headers:header})
  }

  getAws(): Observable<any> {
    const header = new HttpHeaders({
      'Authorization':this.token
    })
    return this.http.get(`https://api.skymetweather.com/v1/mumbai-alldata-fixedlocations?latlon=26.08743414,83.29488407`,{headers:header});
  }
  
  getLocations(value):Observable<any> {
    return this.http.get(`https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=search-location&param=${value.terms}`)
  }

















  getWaterLogData(): Observable<any> {
    return this.http.get('https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=roadjson')
  }

  getRainData(hr): Observable<any> {
       return this.http.get(`https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=rainjson&hr=${hr ? hr :''}`)

  }

  getHeatMap(hr) {

    var header = new HttpHeaders({
      "Content-Type": "image/png"
    })

    var url;
    if(hr) {
       url=  `https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=heatmap&hr=_${hr}`;
    } else {
      url=  "https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=heatmap&hr";

    } 
    return this.http.get(url,{headers:header})
  }
  getLightning(): Observable<any> {

   // return this.http.get(`http://skymet.co/mahavedh_rain/mapApi/lightning?v=2022063014`);
    return this.http.get(`https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=lightning`);
  }

  getWind():Observable<any> {
    return this.http.get('https://www.skymetweather.com/media/wind_hourly.php?ver=1657480114529')
  }

}
