# NFT Versioning & Geohash Signature System

**Identity Signature**: `#AAC.11.11.1992`  
**Purpose**: Track file integrity, ownership, and version history on blockchain  

---

## Overview

This system uses NFT metadata to:
1. **Mint** each production release as an NFT
2. **Track** changes with geohash signatures
3. **Verify** authenticity and ownership
4. **Link** Git commits to blockchain transactions

---

## NFT Metadata Structure

```json
{
  "name": "Sovereign Helix v1.0.0",
  "description": "Production release of TheSovereignHelix.com - Cognitive Mesh AI IDE",
  "image": "ipfs://QmXXX...",
  "external_url": "https://github.com/CashflowNchill510/sovereign-helix-production",
  "attributes": [
    {
      "trait_type": "Version",
      "value": "1.0.0"
    },
    {
      "trait_type": "Release Date",
      "value": "2026-09-01"
    },
    {
      "trait_type": "Geohash Signature",
      "value": "#AAC.11.11.1992"
    },
    {
      "trait_type": "Git Commit",
      "value": "69ffeb6c79668666222c363db9c35c424fcf90bc"
    },
    {
      "trait_type": "File Hash",
      "value": "0x60f8f1d2eba8cf68a896d22e0fdeba41da84f545"
    },
    {
      "trait_type": "Creator",
      "value": "Anthony Angel Campos #AAC.11.11.1992"
    },
    {
      "trait_type": "Domain",
      "value": "TheSovereignHelix.com"
    },
    {
      "trait_type": "Chain",
      "value": "Ethereum Mainnet"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "ipfs://QmXXX.../src/components/CognitiveMeshPanel.tsx",
        "type": "application/x-typescript"
      }
    ],
    "category": "production-release"
  }
}
```

---

## Geohash Signature Breakdown

**Format**: `#AAC.11.11.1992`

| Component | Meaning | Value |
|-----------|---------|-------|
| `#` | Blockchain tag identifier | Constant |
| `AA` | Tier + Authorization | Alpha + Approved |
| `C` | Module Category | Core |
| `11` | Month | November (11) |
| `11` | Day | 11th |
| `1992` | Birth Year | 1992 |

**Full Signature**: Anthony Angel Campos - Core Production Release  

---

## How to Mint NFT for Each Release

### Step 1: Prepare Metadata
```bash
cat > nft-metadata-v1.0.0.json << EOF
{
  "name": "Sovereign Helix v1.0.0",
  "description": "Production release - Cognitive Mesh AI IDE",
  "version": "1.0.0",
  "release_date": "2026-09-01",
  "geohash_signature": "#AAC.11.11.1992",
  "git_commit": "$(git rev-parse HEAD)",
  "file_hash": "0x60f8f1d2eba8cf68a896d22e0fdeba41da84f545"
}
EOF
```

### Step 2: Upload to IPFS
```bash
# Using pinata.cloud or nft.storage
curl -X POST \
  -F file=@nft-metadata-v1.0.0.json \
  https://api.pinata.cloud/pinning/pinFileToIPFS \
  -H "pinata_api_key: YOUR_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET"

# Returns: {"IpfsHash": "QmXXX..."}
```

### Step 3: Smart Contract Mint
```solidity
// Example: ERC-721 mint contract
function mintRelease(
  string memory ipfsHash,
  string memory version,
  string memory geohashSignature
) public onlyOwner {
  uint256 tokenId = releases[version];
  _mint(msg.sender, tokenId);
  _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", ipfsHash)));
  releaseMetadata[tokenId] = ReleaseInfo({
    version: version,
    geohash: geohashSignature,
    timestamp: block.timestamp,
    gitCommit: ""
  });
}
```

### Step 4: Record on Blockchain
```bash
# After mint, store transaction hash
echo "v1.0.0:0x69ffeb6c79668666222c363db9c35c424fcf90bc:Qm..." >> NFT-REGISTRY.txt
git add NFT-REGISTRY.txt
git commit -m "Mint v1.0.0 NFT - #AAC.11.11.1992"
git tag -a nft-v1.0.0 -m "NFT Minted: Sovereign Helix v1.0.0"
git push origin --tags
```

---

## NFT Registry

Each release gets recorded in blockchain:

| Version | Mint Date | Geohash | Git Commit | NFT Contract | IPFS Hash |
|---------|-----------|---------|-----------|--------------|-----------|
| v1.0.0 | 2026-09-01 | #AAC.11.11.1992 | 69ffeb6c | 0xABC... | Qm... |
| v1.1.0 | (pending) | #AAC.11.11.1992 | (pending) | (pending) | (pending) |
| v2.0.0 | (roadmap) | #AAC.11.11.1992 | (roadmap) | (roadmap) | (roadmap) |

---

## Verification Process

### Verify File Integrity
```bash
# Get file hash from git
git rev-list --all | while read commit; do
  git ls-tree -r $commit | grep "CognitiveMeshPanel.tsx" | awk '{print $3}' | head -1
done

# Compare with NFT metadata
# If hashes match → File is authentic and unchanged
```

### Verify Geohash Signature
```bash
# Search all commits for signature
git log --all --grep="#AAC.11.11.1992" --oneline

# Verify signature appears in:
# - Commit messages
# - CHANGELOG.md
# - NFT metadata
# - Smart contract events
```

### Verify on Blockchain
```bash
# Check Etherscan for contract address
# https://etherscan.io/address/0xXXX

# Call contract function
web3.eth.call({
  to: NFT_CONTRACT_ADDRESS,
  data: web3.eth.abi.encodeFunctionCall({
    name: 'getMetadata',
    type: 'function',
    inputs: [{ type: 'uint256', name: 'tokenId' }]
  }, [1])
})
```

---

## Geohash Signature Usage

Every production artifact uses `#AAC.11.11.1992`:

### In Git Commits
```
git commit -m "Release v1.0.0 - #AAC.11.11.1992"
```

### In Files
```typescript
/**
 * Sovereign Helix v1.0.0
 * Geohash: #AAC.11.11.1992
 * Minted: 2026-09-01
 */
```

### In Deployment
```yaml
# kubernetes secret
GEOHASH_SIGNATURE: "#AAC.11.11.1992"
CREATOR: "Anthony Angel Campos"
```

### In NFT Metadata
```json
{
  "geohash_signature": "#AAC.11.11.1992",
  "creator": "Anthony Angel Campos"
}
```

---

## Domain Integration

When domain **TheSovereignHelix.com** is live:

1. **Show NFT Badge** on homepage
   ```html
   <div class="nft-badge">
     Verified: v1.0.0 • #AAC.11.11.1992 
     <a href="https://etherscan.io/token/0x...">View on Etherscan</a>
   </div>
   ```

2. **API Endpoint** for verification
   ```
   GET /api/v1/verify-nft?version=1.0.0&signature=%23AAC.11.11.1992
   Response: { valid: true, mint_date: "2026-09-01", tx_hash: "0x..." }
   ```

3. **Certificate Page**
   ```
   /certificate/v1.0.0
   Shows: Git commit, NFT mint, geohash, IPFS hash, verification
   ```

---

## Smart Contract Addresses

### Mainnet (Production)
- **Contract**: (To be deployed)
- **Token Standard**: ERC-721 (NFT)
- **Symbol**: SHP (Sovereign Helix Production)

### Testnet (Staging)
- **Goerli**: (Pending)
- **Sepolia**: (Pending)

---

## Security Checklist

- [ ] All releases signed with geohash `#AAC.11.11.1992`
- [ ] Git tags match NFT versions
- [ ] IPFS hashes stored in contract
- [ ] Smart contract verified on Etherscan
- [ ] Domain SSL certificate linked to NFT contract
- [ ] Geohash appears in all production documentation
- [ ] Backup metadata stored in GitHub + IPFS

---

## Timeline

| Date | Event | Status |
|------|-------|--------|
| 2026-09-01 | v1.0.0 release candidate | ✅ Created |
| 2026-09-05 | Deploy smart contract | ⏳ Pending |
| 2026-09-10 | Mint v1.0.0 NFT | ⏳ Pending |
| 2026-09-15 | Domain TheSovereignHelix.com live | ⏳ Pending |
| 2026-10-01 | v1.1.0 release + mint | 📋 Planned |

---

**Last Updated**: 2026-09-01  
**Maintained By**: Anthony Angel Campos  
**Geohash**: #AAC.11.11.1992
