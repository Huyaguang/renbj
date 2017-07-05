# Check MongoDB data folder exists or not
if [ ! -d "/mongo-data" ]; then
  mkdir ./mongo-data
fi

# Start MongoDB
mongod --dbpath ./mongo-data/
