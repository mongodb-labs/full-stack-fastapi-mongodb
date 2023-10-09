import asyncio
from beanie import Document, init_beanie
from beanie.odm.fields import Link, BackLink, DeleteRules, WriteRules
from beanie.operators import And, In, PullAll
from motor import motor_asyncio
from pydantic import Field
from pprint import pprint as print


class _MongoClientSingleton:
    mongo_client: motor_asyncio.AsyncIOMotorClient

    def __new__(cls):
        print("NEW")
        if not hasattr(cls, "instance"):
            cls.instance = super(_MongoClientSingleton, cls).__new__(cls)
            print("SINGLE")
        return cls.instance


def MongoDatabase():
    return _MongoClientSingleton()


__all__ = ["MongoDatabase"]


class MainRef(Document):
    main: int = 10
    linker: list[Link["Ref"]]


class Ref(Document):
    subval: int = 50
    parent_ref: BackLink[MainRef] = Field(original_field="linker")


async def startup():
    mongo_client = motor_asyncio.AsyncIOMotorClient()
    await mongo_client.db.command("ping")
    await init_beanie(database=mongo_client.db, document_models=[MainRef, Ref])
    await init_beanie(database=mongo_client.db, document_models=[MainRef, Ref])
    await init_beanie(database=mongo_client.db, document_models=[MainRef, Ref])
    await init_beanie(database=mongo_client.db, document_models=[MainRef, Ref])
    await init_beanie(database=mongo_client.db, document_models=[MainRef, Ref])
    await init_beanie(database=mongo_client.db, document_models=[MainRef, Ref])
    await populate_db()


async def cleanup():
    await MainRef.delete_all()
    await Ref.delete_all()


def decorate(fn):
    async def wrap():
        await startup()
        await fn()
        await cleanup()

    return wrap


async def populate_db():
    main_ref = MainRef(linker=[])
    main_ref = await main_ref.insert()
    ref1 = await Ref(subval=1, parent_ref=main_ref.id).insert()
    ref2 = await Ref(subval=2, parent_ref=main_ref.id).insert()
    main_ref.linker = [ref1, ref2, Ref(subval=3, parent_ref=main_ref.id)]
    await main_ref.save(link_rule=WriteRules.WRITE)


async def backup_logic_validation():
    main_ref = await MainRef.find_one(MainRef.main == 10, fetch_links=True)
    link_doc = None
    if main_ref.linker:
        link_val = main_ref.linker[0]
        link_doc = await link_val.fetch() if isinstance(link_val, Link) else link_val
    await link_doc.delete(link_rule=DeleteRules.DELETE_LINKS)


async def test_link_comparison():
    ref = await Ref.find_one(fetch_links=True)
    await ref.fetch_link(Ref.parent_ref)
    await ref.fetch_link(Ref.parent_ref)
    print(ref)
    main_ref = await MainRef.find_one()
    print("Main ref found!")
    print(main_ref)
    sub_7 = Ref(subval=7, parent_ref=main_ref.id)
    main_ref.linker.append(sub_7)
    await main_ref.save(link_rule=WriteRules.WRITE)
    print(await Ref.find().to_list())
    print(await MainRef.find().to_list())
    await MainRef.update_all(PullAll({MainRef.linker: [sub_7.to_ref()]}))
    print(await MainRef.find().to_list())


@decorate
async def runner():
    await test_link_comparison()
    MongoDatabase()
    MongoDatabase()


if __name__ == "__main__":
    asyncio.run(runner())
