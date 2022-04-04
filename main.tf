# Azure provider source and version
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
  }
}

# Configure the Microsoft Azure provider
provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "resource-group" {
  name     = var.resource-group
  location = var.location
}

# Create a Storage Account
resource "azurerm_storage_account" "storage-account" {
  name                     = "stgaccplay007"
  resource_group_name      = var.resource-group
  location                 = var.location
  account_tier             = "Standard"
  access_tier              = "Hot"
  account_replication_type = "GRS"
}

# Create a Container for blobs
resource "azurerm_storage_container" "blob-container" {
  name                  = "mycontainer"
  storage_account_name  = azurerm_storage_account.storage-account.name
  container_access_type = "private"
}

# Create a blob
resource "azurerm_storage_blob" "blob" {
  name                   = "myblob.zip"
  storage_account_name   = azurerm_storage_account.storage-account.name
  storage_container_name = azurerm_storage_container.blob-container.name
  type                   = "Block"
  source                 = "some-local-file.zip"
}

# Configure policies for the blob lifecycle management
resource "azurerm_storage_management_policy" "storage-policy" {
  storage_account_id = azurerm_storage_account.storage-account

  rule {
    name    = "rule1"
    enabled = true
    filters {
      prefix_match = ["myfiles"]
      blob_types   = ["blockBlob"]
      match_blob_index_tag {
        name      = "tag1"
        operation = "=="
        value     = "val1"
      }
    }
    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than    = 10
        tier_to_archive_after_days_since_modification_greater_than = 50
        delete_after_days_since_modification_greater_than          = 100
      }
      snapshot {
        delete_after_days_since_creation_greater_than = 30
      }
    }
  }
  rule {
    name    = "rule2"
    enabled = false
    filters {
      prefix_match = ["mycontainer", "mycontainer2/test.txt"]
      blob_types   = ["blockBlob"]
    }
    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than    = 11
        tier_to_archive_after_days_since_modification_greater_than = 51
        delete_after_days_since_modification_greater_than          = 101
      }
      snapshot {
        change_tier_to_archive_after_days_since_creation = 90
        change_tier_to_cool_after_days_since_creation    = 23
        delete_after_days_since_creation_greater_than    = 31
      }
      version {
        change_tier_to_archive_after_days_since_creation = 9
        change_tier_to_cool_after_days_since_creation    = 90
        delete_after_days_since_creation                 = 3
      }
    }
  }
}