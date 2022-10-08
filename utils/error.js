const getError = (error) => (error.response && error.response.data && error.response.data.message ? error.response.data.message : error.message)

const onError = (err, req, res, next) => {
  res.status(500).json({ message: err.toString() })
}

export { getError, onError }
