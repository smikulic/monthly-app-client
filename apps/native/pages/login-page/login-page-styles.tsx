import { StyleSheet } from "react-native";

export const loginPageStyles = StyleSheet.create({
  loginPage: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 48,
    backgroundColor: "#fff", // optional, add if needed
  },

  title: {
    paddingHorizontal: 16,
    marginBottom: 16,
    width: 360,
    fontWeight: "300",
    fontSize: 28,
  },

  form: {
    flexDirection: "column",
    paddingHorizontal: 16,
    width: 360,
  },

  formField: {
    marginBottom: 16,
  },

  label: {
    paddingBottom: 6,
    fontSize: 13,
  },

  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },

  actions: {
    flexDirection: "column",
    marginTop: 24,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "100%",
    fontSize: 16,
    color: "black",
    backgroundColor: "#41efcd",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  link: {
    color: "#f199c0",
    borderBottomWidth: 1,
    borderBottomColor: "#f199c0",
  },

  divider: {
    flexDirection: "row",
    marginVertical: 12,
  },
  
  dividerText: {
    flexDirection: "row",
    marginVertical: 6,
  },
});
