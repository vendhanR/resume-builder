import { auth, db } from "../config/firebase.config"
import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'

export const getUserDetail = () => {
    return new Promise((resolve, resject) => {
        const unsubscribeAuth = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred?.providerData[0];
                //onSnapshot is listener, it will constantly listen collection whether data will be modified or deleted or new data inserted 
                try {
                    const unsubscribe = onSnapshot(
                        doc(db, 'users', userData?.uid), (_doc) => {
                            if (_doc.exists()) {
                                resolve(_doc.data())
                            } else {
                                setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                                    resolve(userData)
                                }).catch(err => console.log(err.message))
                            }
                        }
                    );
                    return unsubscribe
                } catch (error) {
                    console.log(error.message)
                }
            } else {
                resject(new Error("User is not authenticated"))
            }
            //prevent memory leaks 
            unsubscribeAuth();
        })
    })
}

export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templatesQuery = query(
            collection(db, 'Templates'),
            orderBy('timestamp', 'asc')
        )
        const unsubscribe = onSnapshot(templatesQuery,
            (querySnap) => {
                const templates = querySnap.docs.map((doc) => doc.data());
                resolve(templates)
            },
            (error) => {
                reject(error)
            }
            )
        return unsubscribe;
    })
}