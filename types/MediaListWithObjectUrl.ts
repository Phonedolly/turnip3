import {
  ChecksumAlgorithm,
  ObjectStorageClass,
  Owner,
  RestoreStatus,
} from "@aws-sdk/client-s3";

export type MediaInfo = {
  /**
   * <p>The name that you assign to an object. You use the object key to retrieve the
   *          object.</p>
   */
  Key?: string;
  /**
   * <p>Creation date of the object.</p>
   */
  LastModified?: string;
  /**
   * <p>The entity tag is a hash of the object. The ETag reflects changes only to the contents
   *          of an object, not its metadata. The ETag may or may not be an MD5 digest of the object
   *          data. Whether or not it is depends on how the object was created and how it is encrypted as
   *          described below:</p>
   *          <ul>
   *             <li>
   *                <p>Objects created by the PUT Object, POST Object, or Copy operation, or through the
   *                Amazon Web Services Management Console, and are encrypted by SSE-S3 or plaintext, have ETags that
   *                are an MD5 digest of their object data.</p>
   *             </li>
   *             <li>
   *                <p>Objects created by the PUT Object, POST Object, or Copy operation, or through the
   *                Amazon Web Services Management Console, and are encrypted by SSE-C or SSE-KMS, have ETags that are
   *                not an MD5 digest of their object data.</p>
   *             </li>
   *             <li>
   *                <p>If an object is created by either the Multipart Upload or Part Copy operation, the
   *                ETag is not an MD5 digest, regardless of the method of encryption. If an object is
   *                larger than 16 MB, the Amazon Web Services Management Console will upload or copy that object as a
   *                Multipart Upload, and therefore the ETag will not be an MD5 digest.</p>
   *             </li>
   *          </ul>
   */
  ETag?: string;
  /**
   * <p>The algorithm that was used to create a checksum of the object.</p>
   */
  ChecksumAlgorithm?: (ChecksumAlgorithm | string)[];
  /**
   * <p>Size in bytes of the object</p>
   */
  Size?: number;
  /**
   * <p>The class of storage used to store the object.</p>
   */
  StorageClass?: ObjectStorageClass | string;
  /**
   * <p>The owner of the object</p>
   */
  Owner?: Owner;
  /**
   * <p>Specifies the restoration status of an object. Objects in certain storage classes must be restored
   *          before they can be retrieved. For more information about these storage classes and how to work with
   *          archived objects, see <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/archived-objects.html">
   *             Working with archived objects</a> in the <i>Amazon S3 User Guide</i>.</p>
   */
  RestoreStatus?: RestoreStatus;
  objectUrl: string;
};
