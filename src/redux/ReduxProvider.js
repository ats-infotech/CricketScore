import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { persistor, store } from "./store";

function Reduxprovider({ children, store, persistor}) {
    return (
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}

export default Reduxprovider;