import { toast } from "react-toastify"
import { auth, db } from "../config/firebase.config"
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore'

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

export const saveToCollection = async (user, data) => {
    const docRef = doc(db, "users", user?.uid);
    if (!user?.collection?.includes(data?._id)) {
        await updateDoc(docRef, {
            collection: arrayUnion(data?._id)
        }).then(() => toast.success("Added to Collection")).catch((error) => toast.error(`Error ${error.message}`))
    } else {
        await updateDoc(docRef, {
            collection: arrayRemove(data?._id)
        }).then(() => toast.error("Removed from Collection")).catch((error) => toast.error(`Error ${error.message}`))
    }
};

export const saveToFavourites = async (user, data) => {
    const docRef = doc(db, "Templates", data?._id);
    if (!data?.favourites?.includes(user?.uid)) {
        await updateDoc(docRef, {
            favourites: arrayUnion(user?.uid)
        }).then(() => toast.success("Added to favourits")).catch((error) => toast.error(`Error ${error.message}`))
    } else {
        await updateDoc(docRef, {
            favourites: arrayRemove(user?.uid)
        }).then(() => toast.error("Removed from favourits")).catch((error) => toast.error(`Error ${error.message}`))
    }
} 