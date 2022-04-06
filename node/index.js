const { BlobServiceClient } = require("@azure/storage-blob");
const pg = require("pg");

require("dotenv").config();

const config = {
  host: "postgres-migration.postgres.database.azure.com",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: true,
};

const client = new pg.Client(config);

client.connect((err) => {
  if (err) throw err;
  else {
    migrateBlob();
  }
});

function migrateBlob() {
  console.log("Azure Blob storage v12 - JavaScript quickstart sample");
  // Read Azure Storage connection string
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error("Azure Storage Connection string not found");
  }
  // Create te BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  // Create a unique name for the container
  const containerName = "images";
  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const query = "SELECT id, image FROM blob;";

  client
    .query(query)
    .then((res) => {
      const rows = res.rows;

      const requests = rows.map(async (row) => {
        // Create a unique name for the blob
        const blobName = `image-${row["id"]}.jpeg`;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log("\nUploading to Azure storage as blob:\n\t", blobName);

        // Upload data to the blob
        const data = row["image"];
        const uploadBlobResponse = await blockBlobClient.upload(
          data,
          data.length
        );
        console.log(
          `Blob ${blobName} was uploaded successfully. requestId: `,
          uploadBlobResponse.requestId
        );
      });
      Promise.all(requests).then(() => process.exit());
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
