const LandingPage = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return { }
}

export default LandingPage
