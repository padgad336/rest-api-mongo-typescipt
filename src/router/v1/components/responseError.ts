const ResponseError = (error: unknown, res: { status: any }) => {
  console.error(error)
  res.status(500).json({
    status: 500,
    code: 'ERROR_INTERNAL_SERVER',
    message: 'Unknown Internal Server Error.',
  })
}

export default ResponseError
