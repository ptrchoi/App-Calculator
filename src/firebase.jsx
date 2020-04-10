import firebase from 'firebase';

// App's Firebase configuration
const firebaseConfig = {
	apiKey: '***REMOVED***',
	authDomain: '***REMOVED***',
	databaseURL: '***REMOVED***',
	projectId: '***REMOVED***',
	storageBucket: '***REMOVED***.appspot.com',
	messagingSenderId: '***REMOVED***',
	appId: '1:***REMOVED***:web:***REMOVED***',
	measurementId: '***REMOVED***'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
