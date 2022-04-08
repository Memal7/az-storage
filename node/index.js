const { BlobServiceClient } = require("@azure/storage-blob");
const pg = require("pg");

require("dotenv").config();

const config = {
  host: process.env.AZ_POSTGRESQL_SERVER_NAME + ".postgres.database.azure.com",
  user: process.env.AZ_POSTGRESQL_USERNAME,
  password: process.env.AZ_POSTGRESQL_PASSWORD,
  database: process.env.AZ_DATABASE_NAME,
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
  const AZ_STORAGE_CONNECTION_STRING = process.env.AZ_STORAGE_CONNECTION_STRING;
  if (!AZ_STORAGE_CONNECTION_STRING) {
    throw Error("Azure Storage Connection string not found");
  }
  // Create te BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZ_STORAGE_CONNECTION_STRING
  );
  // Set existing container names
  const containerNameImages = "images";
  const containerNameVideos = "videos";
  // Get a reference to a container
  const containerClientImages =
    blobServiceClient.getContainerClient(containerNameImages);
  const containerClientVideos =
    blobServiceClient.getContainerClient(containerNameVideos);

  const query = "SELECT id, image, video FROM blob;";

  client
    .query(query)
    .then((res) => {
      const rows = res.rows;

      const requests = rows.map(async (row) => {
        // Create a unique name for the blob
        const blobNameImage = `image-${row["id"]}.jpeg`;
        const blobNameVideo = `video-${row["id"]}.mp4`;

        // Get a block blob client
        const blockBlobClientImage =
          containerClientImages.getBlockBlobClient(blobNameImage);
        const blockBlobClientVideo =
          containerClientVideos.getBlockBlobClient(blobNameVideo);

        // Upload image data to the blob
        console.log("\nUploading to Azure storage as blob:\n\t", blobNameImage);
        const dataImage = row["image"];
        const uploadBlobResponseImage = await blockBlobClientImage.upload(
          dataImage,
          dataImage.length
        );
        console.log(
          `Blob ${blobNameImage} was uploaded successfully. requestId: `,
          uploadBlobResponseImage.requestId
        );
        // Upload video data to the blob
        console.log("\nUploading to Azure storage as blob:\n\t", blobNameVideo);
        const dataVideo = row["video"];
        const uploadBlobResponseVideo = await blockBlobClientVideo.upload(
          dataVideo,
          dataVideo.length
        );
        console.log(
          `Blob ${blobNameVideo} was uploaded successfully. requestId: `,
          uploadBlobResponseVideo.requestId
        );
      });
      Promise.all(requests).then(() => process.exit());
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
