import firebase from 'firebase';

// App's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCwWvHykjR2rd3MtGpS-9qif6CAFGWD_kA',
	authDomain: 'minimal-calculator-e7b71.firebaseapp.com',
	databaseURL: 'https://minimal-calculator-e7b71.firebaseio.com',
	projectId: 'minimal-calculator-e7b71',
	storageBucket: 'minimal-calculator-e7b71.appspot.com',
	messagingSenderId: '805083026810',
	appId: '1:805083026810:web:d6b330d129191ebe9032c3'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
