# Azure PostgreSQL to Azure Blob Storage Migration

Basic example of how to migrate images and videos from Azure PostgreSQL to Azure Blob Storage account with Java JDBC and streaming.

## Prerequisites

- An Azure account with an active subscription. Create an account for free.
- An Azure Storage account with containers named `images` and `videos`. Create a storage account.
- An Azure PostgreSQL with an id field, an `image` field containg the image binary, and a `video` field containing the video binary.
- Maven and Java.

## Prepare the working environment

Create a src/main/resources/application.properties file, and add:

```
url=jdbc:postgresql://<AZ_DATABASE_NAME>.postgres.database.azure.com:5432/blob?ssl=true&sslmode=require
user=<AZ_DATABASE_NAME>
password=<AZ_POSTGRESQL_PASSWORD>
connectStr=<AZ_STORAGE_CONNECTION_STRING>
```

Replace the placeholders with the following values:

- `<AZ_DATABASE_NAME>`: The name of your PostgreSQL server. It should be unique across Azure.
- `<AZ_POSTGRESQL_USERNAME>`: The username of your PostgreSQL database server.
- `<AZ_POSTGRESQL_PASSWORD>`: The password of your PostgreSQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<AZ_STORAGE_CONNECTION_STRING>`: The storage connection string for your blob storage.

## Run the code

Navigate to the directory containing the pom.xml file and compile the project by using the following mvn command.

Build the package:

```
mvn package
```

Run the following mvn command to execute the app.

```
mvn exec:java -Dexec.mainClass="com.blobs.quickstart.App" -Dexec.cleanupDaemonThreads=false

```

## Additional Documentation

- [Quickstart: Use Java and JDBC with Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/connect-java)
- [Quickstart: Manage blobs with Java v12 SDK](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-java?tabs=powershell%2Cenvironment-variable-linux)

