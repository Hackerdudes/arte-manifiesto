/**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */

var DataApp = {};
DataApp.currentUser = null;
DataApp.baseUrl = window.location.origin + '/';
DataApp.baseTitle = 'Arte Manifiesto | ';
DataApp.loginUrl = DataApp.baseUrl + 'auth/login';
DataApp.discoverWorks = DataApp.baseUrl + 'works/category/all/page-1/';
DataApp.discoverUsers = DataApp.baseUrl + 'users/specialties/all/page-1/';
DataApp.discoverProducts = DataApp.baseUrl + 'products/type/all/page-1/';
DataApp.searchCollections = DataApp.baseUrl + 'artjam/collections/page-1';

DataApp.currentUrl = window.location.href.replace(/\/$/g, '');
DataApp.currentUrl = DataApp.currentUrl.replace(/#_=_$/g, '');
DataApp.fbAppID = '1473636902857068';

var Events = {};
Events.LOAD_START = 'loadStart';
Events.LOAD_END = 'loadEnd';
Events.COLLECTION_ITEM_SELECTED = 'collectionItemSelected';
Events.ADD_COLLECTION = 'addCollection';
Events.SHARE = 'share';


var Validations = {
  notBlank: function(value) {
    if(!value) {return true};
    return '' === value.replace( /^\s+/g, '' ).replace( /\s+$/g, '' )
  }
}
