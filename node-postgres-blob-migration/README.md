# Azure PostgreSQL to Azure Blob Storage Migration

Basic example of how to migrate images and videos from Azure PostgreSQL to Azure Blob Storage account with Node.js.

## Prerequisites

- An Azure account with an active subscription. Create an account for free.
- An Azure Storage account with containers named `images` and `videos`. Create a storage account.
- An Azure PostgreSQL with an id field, an `image` field containg the image binary, and a `video` field containing the video binary.
- Node.js LTS.

## Prepare the working environment

First, set up some environment variables by using the following commands:

```bash
AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
AZ_POSTGRESQL_SERVER_NAME=<YOUR_POSTGRESQL_SERVER_NAME>
AZ_POSTGRESQL_USERNAME=<YOUR_POSTGRESQL_USERNAME>
AZ_POSTGRESQL_PASSWORD=<YOUR_POSTGRESQL_PASSWORD>
AZ_STORAGE_CONNECTION_STRING=<YOUR_BLOB_STORAGE_CONNECTION_STRING>
```

Replace the placeholders with the following values:

- `<YOUR_DATABASE_NAME>`: The name of your PostgreSQL server. It should be unique across Azure.
- `<YOUR_POSTGRESQL_SERVER_NAME>`: The server name of your PostgreSQL database server.
- `<YOUR_POSTGRESQL_USERNAME>`: The username of your PostgreSQL database server.
- `<YOUR_POSTGRESQL_PASSWORD>`: The password of your PostgreSQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_BLOB_STORAGE_CONNECTION_STRING>`: The storage connection string for your blob storage.

## Install Node.js dependencies

Install [pg](https://www.npmjs.com/package/pg), which is a PostgreSQL client for Node.js and [azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob), which is a Azure Storage Blob client for Node.js.

## Additional Documentation

- [Quickstart: Manage blobs with JavaScript v12 SDK in Node.js](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs?tabs=environment-variable-linux)
- [Quickstart: Use Node.js to connect and query data in Azure Database for PostgreSQL -- Single Server](https://docs.microsoft.com/en-us/azure/postgresql/connect-nodejs)
