# Azure Blob Storage

## What's Blob Storage?
Azure Blob storage is the object storage solution of Microsoft Azure, which is optimized for storing unstructured data. Users or clients (e.g. apps) can access objects in Blob storage via HTTP/HTTPS, from anywhere in the world. The Objects are accessible via the Azure Storage REST API, Azure PowerShell, Azure CLI, or an Azure Storage client library (.NET, Java, Python, Node.js, etc.).

Blob storage is designed for:
- Images or documents to a browser
- Storing files for distributed access
- Data for backup and restore, disaster recovery, archiving
- Writing to log files
- Video and audio files
- Supports also azure Data Lake Gen2

---

## Storage account and Blob types
|    Storage account types    |      Supported storage services                         	      |    Usage                                                                                                                                 |
|           :---              |     :---                                                        |   :---                                                                                                                                   |
| Standard general-purpose v2 | Blob (incl. Data Lake Gen2), Queue, Table, Disks, Files         | Optimized for most scenarios                                                                                                             |
| Premium block blobs         | Blobs only (e.g. text, binaries, videos, audios, etc.)          | Optimized for app that requires high transaction rates, I/O operations. This type used SSD storage                                       |
| Premium page blobs          | Page blobs only (e.g. random access files, VHDs as diks for VMs)| Optimized for frequently read/write operations and ideal for storing index-based and sparse data structures like OS & data disks for VMs |
| Premium append blobs        | Append blobs only (e.g. logging data for VMs)                   | Optimized for frequently read/write operations and ideal for storing index-based and sparse data structures like OS & data disks for VMs |
| Premium file shares         | Azure Files                                                     | Optimized for enterprise high-performance apps. This types used SSD as well and supports both SMB and NFS file shares                    |


---

## Blob storage access tiers
- **Hot:**
  - Optimized for frequent access data
  - Highest storage costs, but the lowest access costs
  - Default tier
- **Cool:**
  - Optimized for infrequently accessed data
  - Lower storage cost, but highest access costs
  - Stored at least 30 days
- **Archive:**
  - Optimized for several hours retrieval latency
  - Most cost-effective storage cost, but most expensive for accessing data
  - Stored at least 180 days

---

## Blob storage resources
- **Storage account:** Top level of all storage services. Storage  name e.g. _mystorageaccount007_ (must be globally unique!)
- **Container:** Similar to a directory on file system. A Storage account have unlimited containers and a container can have unlimited blobs.
- **Blob:** Single file e.g. text, video, etc.

![Blob storage resources](00_images/blob-resources.png)

---

## Blob life cycle management
Blob storage offers policies for diffrent scenarios and it's available for general-purpose v2 and all Blob storage types.
With Policies for blobs you can configure rules to transit the blobs from one access tier to another one (e.g. hot --> cool) to optimize performance and costs or delete blobs after specefic days.

---

## Demos
Look at to the [Bicep](01_stoarge-bicep/) and [Terraform](02_storage-terraform/) directories.


