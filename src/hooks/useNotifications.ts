// ... previous imports ...

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const user = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync().then(pushToken => {
      if (pushToken) {
        setExpoPushToken(pushToken);
      }
    });

    // ... rest of the implementation
  }, []);

  // ... rest of the hook
};
